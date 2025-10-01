"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getAccountWithTransactions(accountId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal),
  };
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");
    
    
    if (!transactionIds || transactionIds.length === 0) {
      throw new Error("No transaction IDs provided");
    }

    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });


    if (transactions.length === 0) {
      throw new Error("No transactions found to delete");
    }

    // Group transactions by account to update balances
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
  // Convert to number to ensure proper arithmetic
  const amount = parseFloat(transaction.amount);
  const change = transaction.type === "EXPENSE" ? amount : -amount;
  
  // Ensure we're doing numeric addition
  acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
  return acc;
}, {});

    // Delete transactions and update account balances in a transaction
    const result = await db.$transaction(async (tx) => {
      // Delete transactions
      const deletedResult = await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });


      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }

      return deletedResult;
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { 
      success: true, 
      deletedCount: result.count,
      message: `Successfully deleted ${result.count} transaction(s)`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
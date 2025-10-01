"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";

const serializeTransaction = (obj) => {
    const serialized = {...obj};
    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }
    if(obj.amount){
        serialized.amount = obj.amount.toNumber(); // Fixed: was using obj.balance instead of obj.amount
    }
    return serialized;
};

export async function createAccount(data){
    try{
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });

        if(!user){
            throw new Error("User not found");
        }

        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)){
            throw new Error("Invalid balance amount");
        }

        const existingAccounts = await db.account.findMany({
            where: {userId: user.id},
        });

        const shouldBeDefault = existingAccounts.length===0?true:data.isDefault;
        if(shouldBeDefault){
            await db.account.updateMany({
                where: {userId: user.id, isDefault: true},
                data: {isDefault: false},
            });

        }
        const account = await db.account.create({
            data:{
                ...data,
                balance:balanceFloat,
                userId:user.id,
                isDefault:shouldBeDefault,
            },
        });

        const serializedAccount = serializeTransaction(account);
        revalidatePath("/dashboard")
        return{success: true, data: serializedAccount};

    } catch(error){
        throw new Error(error.message);
    }
}

export async function getUserAccounts(){
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    
    if (!user){
        throw new Error("User not found");
    }

    const account = await db.account.findMany({
        where: {userId:user.id},
        orderBy:{createdAt:"asc"},
        include:{
            _count:{
                select:{
                    transactions: true,
                }
            }
        }
    });

    const serializedAccount = account.map(serializeTransaction);
    return serializedAccount;
}

export async function updateAccount(accountId, data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Verify the account belongs to the user
        const existingAccount = await db.account.findFirst({
            where: {
                id: accountId,
                userId: user.id,
            },
        });

        if (!existingAccount) {
            throw new Error("Account not found or unauthorized");
        }

        const balanceFloat = parseFloat(data.balance);
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        // Handle default account logic
        if (data.isDefault && !existingAccount.isDefault) {
            // If setting this account as default, unset all other defaults
            await db.account.updateMany({
                where: {
                    userId: user.id,
                    isDefault: true,
                    id: { not: accountId }, // Exclude current account
                },
                data: { isDefault: false },
            });
        }

        // Prepare clean data for update - only include fields that should be updated
        const updateData = {
            name: data.name,
            type: data.type,
            balance: balanceFloat,
            isDefault: data.isDefault,
        };

        const updatedAccount = await db.account.update({
            where: { id: accountId },
            data: updateData,
            include: {
                _count: {
                    select: {
                        transactions: true,
                    }
                }
            }
        });

        const serializedAccount = serializeTransaction(updatedAccount);
        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount };

    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteAccount(accountId) {
    try {
        
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Verify the account belongs to the user
        const existingAccount = await db.account.findFirst({
            where: {
                id: accountId,
                userId: user.id,
            },
        });

        if (!existingAccount) {
            throw new Error("Account not found or unauthorized");
        }

        // Check if account has transactions
        const transactionCount = await db.transaction.count({
            where: { accountId: accountId },
        });

        if (transactionCount > 0) {
            throw new Error("Cannot delete account with existing transactions. Please delete all transactions first.");
        }

        // If this was the default account, make another account default
        if (existingAccount.isDefault) {
            const otherAccount = await db.account.findFirst({
                where: {
                    userId: user.id,
                    id: { not: accountId },
                },
            });

            if (otherAccount) {
                await db.account.update({
                    where: { id: otherAccount.id },
                    data: { isDefault: true },
                });
            }
        }

        await db.account.delete({
            where: { id: accountId },
        });

        revalidatePath("/dashboard");
        return { success: true, deletedId: accountId };

    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getDashboardData(accountid) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id, accountId: accountid},
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}

export async function getDefaultAccountSummary(accountid) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    // Fetch user
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Fetch account details
    const account = await db.account.findUnique({
      where: { id: accountid, userId: user.id },
    });

    if (!account) throw new Error("Account not found");

    // Sum all incomes
    const incomeAgg = await db.transaction.aggregate({
      where: {
        userId: user.id,
        accountId: accountid,
        type: "INCOME",
      },
      _sum: { amount: true },
    });

    // Sum all expenses
    const expenseAgg = await db.transaction.aggregate({
      where: {
        userId: user.id,
        accountId: accountid,
        type: "EXPENSE",
      },
      _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount?.toNumber() || 0;
    const totalExpenses = expenseAgg._sum.amount?.toNumber() || 0;
    const balance = account.balance.toNumber();
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      account: {
        id: account.id,
        name: account.name,
        balance,
        totalIncome,
        totalExpenses,
        savingsRate,
      },
    };
  } catch (error) {
    console.error("Error fetching default account summary:", error);
    throw error;
  }
}

export async function getDefaultAccountExpenses() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  // Fetch user
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    console.error("Server No matching DB user found for Clerk user:", userId);
    return [];
  }

  // Fetch default account
  const defaultAccount = await db.account.findFirst({
    where: { userId: user.id, isDefault: true },
  });

  if (!defaultAccount) {
    console.error("Server No default account found for user:", user.id);
    return [];
  }

  // Group expenses by category
  const grouped = await db.transaction.groupBy({
    by: ["category"],
    where: {
      userId: user.id,
      accountId: defaultAccount.id,
      type: "EXPENSE",
    },
    _sum: { amount: true },
  });


  // Assign colors dynamically (fallback palette)
  const COLORS = [
    "#4F46E5", "#10B981", "#F59E0B", "#EF4444",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
  ];

  const chartData = grouped.map((g, idx) => ({
    category: g.category || "Uncategorized",
    amount: g._sum.amount ? Number(g._sum.amount) : 0, // ✅ Decimal → number
    color: COLORS[idx % COLORS.length],
  }));


  return chartData;
}

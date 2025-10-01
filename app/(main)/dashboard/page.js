import { getCurrentBudget } from '@/actions/budget';
import { getDashboardData, getDefaultAccountExpenses, getDefaultAccountSummary, getUserAccounts } from '@/actions/dashboard';
import AccountManagement from '@/components/dashboard/AccountManagement';
import { BudgetIndicator } from '@/components/dashboard/BudgetIndicator';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { currentUser } from '@clerk/nextjs/server';
import Footer from '@/components/Footer';

export default async function DashboardPage() {
  const accounts = await getUserAccounts();

  const user = await currentUser();
  const defaultAccount = accounts?.find((account) => account.isDefault);
  const expenses = await getDefaultAccountExpenses();

  let budgetData = null;
  let defaultAccountSummary = null;
  let transactions = null;

  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
    defaultAccountSummary = await getDefaultAccountSummary(defaultAccount.id);
    transactions = await getDashboardData(defaultAccount.id);
  }
  return (
    <div>
      <main className="container mx-auto px-4 pt-24 pb-8">
        <WelcomeSection
          username={user.raw.first_name}
          accountSummary={defaultAccountSummary?.account} // pass the data
        />

        <BudgetIndicator
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RecentTransactions transactions={transactions} />
          <ExpenseChart expenses={expenses} />
        </div>

        <AccountManagement account={accounts} />
      </main>

      <Footer />
    </div>
  );
}

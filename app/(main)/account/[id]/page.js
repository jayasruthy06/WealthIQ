import { getAccountWithTransactions } from '@/actions/account'
import AccountChart from '@/components/account/AccountChart';
import AccountIntroduction from '@/components/account/AccountIntroduction';
import TransactionTable from '@/components/account/TransactionTable';
import AIInsights from '@/components/AIInsights';
import BarLoader from '@/components/BarLoader';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

const AccountsPage = async ({params}) => {
    const accountData = await getAccountWithTransactions(params.id);
    if(!accountData){
        notFound();
    }

    const {transactions, ...account} = accountData;
  return (
    <div className="space-y-8 px-5">
        <div className="flex gap-4 items-end justify-between">
            <AccountIntroduction account={account}/>
        </div>
        
        <Suspense
            fallback={<BarLoader/>}
        >
            <AccountChart transactions={transactions} />
        </Suspense>
        
        <AIInsights transactions={transactions}/>

        <Suspense
            fallback={<BarLoader/>}
        >
           <TransactionTable transactions={transactions}/>
        </Suspense>
        <Footer/>
    </div>
  )
}

export default AccountsPage
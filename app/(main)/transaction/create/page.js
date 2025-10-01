import { getUserAccounts } from '@/actions/dashboard';
import { getTransaction } from '@/actions/transactions';
import Footer from '@/components/Footer';
import AddTransactionForm from '@/components/transaction/AddTransactionForm';
import { defaultCategories } from '@/data/category';
import React from 'react'

const AddTransactionPage = async ({searchParams}) => {
  const accounts = await getUserAccounts();
    const editId = searchParams?.edit;
  
    let initialData = null;
    if (editId) {
      const transaction = await getTransaction(editId);
      initialData = transaction;
    }
  
    return (
      <>
      <div className="max-w-3xl mx-auto px-5 mb-10">
        <div className="flex justify-center md:justify-normal mb-8">
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mt-20 mb-2">Add Transaction</h1>
        </div>
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
      
      </>
    )
}

export default AddTransactionPage;
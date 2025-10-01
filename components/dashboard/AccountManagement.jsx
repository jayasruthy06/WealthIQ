"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
  Building,
  Plus,
  Star,
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Send,
  Receipt,
  X,
  DollarSign,
  Filter,
  Search,
  Home,
  Loader2,
  BadgeIndianRupee,
  ArrowLeftRight
} from "lucide-react";

import { accountSchema } from "@/app/lib/schema";
import { createAccount, updateAccount, deleteAccount } from "@/actions/dashboard";
import Link from "next/link";

const accountTypeConfig = {
  CURRENT: {
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400"
  },
  SAVINGS: {
    icon: PiggyBank,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
    textColor: "text-green-400"
  },
  INVESTMENT: {
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400"
  },
  CREDIT: {
    icon: Wallet,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400"
  },
  BUSINESS: {
    icon: Building,
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-400"
  },
  MORTGAGE: {
    icon: Home,
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10",
    textColor: "text-red-400"
  }
};

// Switch Component (shadcn/ui inspired)
const Switch = ({ checked, onCheckedChange, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 
        focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed 
        disabled:opacity-50
        ${checked ? 'bg-primary' : 'bg-input'}
      `}
    >
      <span
        className={`
          pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 
          transition-transform
          ${checked ? 'translate-x-4' : 'translate-x-0'}
        `}
      />
    </button>
  );
};

export default function AccountManagement({ account = [] }) {
  const [accounts, setAccounts] = useState(account);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);

  // Form setup using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  // Fetch hooks
  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error: createError,
    data: newAccount,
  } = useFetch(createAccount);

  const {
    loading: updateAccountLoading,
    fn: updateAccountFn,
    error: updateError,
    data: updatedAccount,
  } = useFetch(updateAccount);

  const {
    loading: deleteAccountLoading,
    fn: deleteAccountFn,
    error: deleteError,
    data: deletedAccount,
    reset: resetDelete,
  } = useFetch(deleteAccount);

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || account.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatCurrency = amount =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);

  // Form submit handler
  const onSubmit = async (data) => {
    if (editingAccount) {
      await updateAccountFn(editingAccount.id, data);
    } else {
      await createAccountFn(data);
    }
  };

  // Handle successful account creation
  useEffect(() => {
  if (newAccount) {
    toast.success("Account created successfully");
    setAccounts(prev => [...prev, {
      ...newAccount.data,
      _count: { transactions: 0 }
    }]);
    reset();
    handleCloseModal();
  }
}, [newAccount, reset]);

  // Handle successful account update
  useEffect(() => {
    if (updatedAccount) {
      toast.success("Account updated successfully");
      setAccounts(prev => prev.map(acc => 
        acc.id === updatedAccount.data.id ? {...updatedAccount.data, _count: acc._count} : acc
      ));
      reset();
      handleCloseModal();
    }
  }, [updatedAccount, reset]);

  // Handle successful account deletion
  useEffect(() => {
    if (deletedAccount && deleteConfirmId) {
      toast.success("Account deleted successfully");
      setAccounts(prev => prev.filter(acc => acc.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      // Reset the delete useFetch state for next operation
      setTimeout(() => resetDelete(), 100);
    }
  }, [deletedAccount, deleteConfirmId, resetDelete]);

  // Handle errors
  useEffect(() => {
    const error = createError || updateError || deleteError;
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [createError, updateError, deleteError]);

  const handleSetDefault = async (e, id, isDefault) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    // Optimistically update UI
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isDefault: acc.id === id ? isDefault : (isDefault ? false : acc.isDefault)
    })));
    
    // Prepare minimal data for update
    const updateData = {
      name: accounts.find(acc => acc.id === id)?.name,
      type: accounts.find(acc => acc.id === id)?.type,
      balance: accounts.find(acc => acc.id === id)?.balance.toString(),
      isDefault: isDefault
    };
    
    try {
      await updateAccountFn(id, updateData);
    } catch (error) {
      // Revert optimistic update on error
      setAccounts(prev => prev.map(acc => ({
        ...acc,
        isDefault: acc.id === id ? !isDefault : acc.isDefault
      })));
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmId) {
      try {
        await deleteAccountFn(deleteConfirmId);
        // Don't handle success here - let useEffect handle it
      } catch (error) {
        // Error handling is done in useFetch, but we can add additional handling if needed
        console.error("Delete failed:", error);
      }
    }
  };

  const handleEditAccount = account => {
    setEditingAccount(account);
    setValue("name", account.name);
    setValue("type", account.type);
    setValue("balance", account.balance.toString());
    setValue("isDefault", account.isDefault);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingAccount(null);
    reset();
  };

  const isLoading = createAccountLoading || updateAccountLoading || deleteAccountLoading;
 
  return (
    <div className="space-y-6 mt-10">
      {accounts.length === 0 && !isLoading && (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2">No Accounts Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Get started by adding your first financial account to begin tracking your wealth.
        </p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-200 transform hover:scale-105"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          Add Your First Account
        </button>
      </div>
      )}
      {accounts.length > 0 && (
        <>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Account Management</h2>
          <p className="text-muted-foreground">Manage and monitor your financial accounts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          >
            <option value="ALL">All Types</option>
            <option value="CURRENT">Current</option>
            <option value="SAVINGS">Savings</option>
            <option value="INVESTMENT">Investment</option>
            <option value="CREDIT">Credit</option>
            <option value="BUSINESS">Business</option>
            <option value="MORTGAGE">Mortgage</option>
          </select>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => {
          const config = accountTypeConfig[account.type] || accountTypeConfig.CURRENT;
          const IconComponent = config.icon;
          
          return (
            <div
              key={account.id}
               className={`group relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-primary/10 ${
                account.isDefault ? 'ring-2 ring-primary/30 border-primary/50' : ''
              }`}
            >
              {/* Default Badge */}
              {account.isDefault && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Default
                </div>
              )}

              {/* Actions Menu */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAccount(account);
                    }}
                    className="p-2 bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
                    title="Edit account"
                    disabled={isLoading}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetDelete(); // Reset before setting new delete ID
                      setDeleteConfirmId(account.id);
                    }}
                    className="p-2 bg-muted/50 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
                    title="Delete account"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Clickable Link Area */}
              <Link href={`/account/${account.id}`} className="block">
                {/* Account Icon */}
                <div className={`w-12 h-12 rounded-lg ${config.bgColor} flex items-center justify-center mb-4`}>
                  <IconComponent className={`w-6 h-6 ${config.textColor}`} />
                </div>

                {/* Account Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{account.name}</h3>
                    <p className={`text-sm capitalize ${config.textColor}`}>
                      {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
                    </p>
                  </div>

                  <div>
                    <p className="text-2xl font-bold font-heading">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {account._count?.transactions} {account._count?.transactions === 1 ? 'Transaction' : 'Transactions'}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Default Account Switch - Outside of Link */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-3">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={(e) => handleSetDefault(e, account.id, !account.isDefault)}
                >
                  <Switch
                    checked={account.isDefault}
                    onCheckedChange={(checked) => handleSetDefault(e, account.id, checked)}
                    disabled={isLoading}
                  />
                  <span className="text-sm text-muted-foreground">
                    Make default account
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
      {/* Add/Edit Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {editingAccount ? 'Edit Account' : 'Create New Account'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Account Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g., Main Checking"
                  {...register("name")}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Account Type
                </label>
                <select
                  id="type"
                  {...register("type")}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  disabled={isLoading}
                >
                  <option value="CURRENT">Current</option>
                  <option value="SAVINGS">Savings</option>
                  <option value="INVESTMENT">Investment</option>
                  <option value="CREDIT">Credit</option>
                  <option value="BUSINESS">Business</option>
                  <option value="MORTGAGE">Mortgage</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="balance"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {editingAccount ? 'Current Balance' : 'Initial Balance'}
                </label>
                <div className="relative">
                  <BadgeIndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("balance")}
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    disabled={isLoading}
                  />
                </div>
                {errors.balance && (
                  <p className="text-sm text-red-500">{errors.balance.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="space-y-0.5">
                  <label
                    htmlFor="isDefault"
                    className="text-base font-medium cursor-pointer"
                  >
                    Set as Default
                  </label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    This account will be selected by default for transactions
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  checked={watch("isDefault")}
                  onCheckedChange={(checked) => setValue("isDefault", checked)}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-primary/70 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingAccount ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    editingAccount ? 'Update Account' : 'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex h-full items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">Delete Account</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to delete this account? This action cannot be undone and will only work if there are no transactions.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 hover:text-white transition-colors"
                  disabled={deleteAccountLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleteAccountLoading}
                >
                  {deleteAccountLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && filteredAccounts.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* No Results */}
      {filteredAccounts.length === 0 && !isLoading && accounts.length > 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold mb-2">No Results Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
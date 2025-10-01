"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, TrendingUp, TrendingDown, AlertCircle, CheckCircle, X, DollarSign, IndianRupee } from 'lucide-react';
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { updateBudget } from "@/actions/budget";

export const BudgetIndicator = ({ initialBudget, currentExpenses }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(initialBudget?.amount?.toString() || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error: updateError,
  } = useFetch(updateBudget);

  // Calculate budget metrics
  const budgetAmount = initialBudget?.amount || 0;
  const spentAmount = currentExpenses || 0;
  const remainingAmount = budgetAmount - spentAmount;
  const spentPercentage = budgetAmount > 0 ? Math.min((spentAmount / budgetAmount) * 100, 100) : 0;
  const isOverBudget = spentAmount > budgetAmount;
  const isNearLimit = spentPercentage >= 80 && !isOverBudget;
  const isHealthy = spentPercentage < 80;

  // Create data object to match original component structure
  const data = {
    total: budgetAmount,
    spent: spentAmount,
    remaining: remainingAmount
  };

  const getBudgetStatus = () => {
    if (isOverBudget) return { color: 'text-red-400', bg: 'bg-red-500/20', icon: TrendingDown };
    if (isNearLimit) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: AlertCircle };
    return { color: 'text-green-400', bg: 'bg-green-500/20', icon: CheckCircle };
  };

  const status = getBudgetStatus();
  const StatusIcon = status.icon;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSaveBudget = async () => {
    const newBudget = parseFloat(editingBudget);
    if (isNaN(newBudget) || newBudget <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }

    setError('');
    const result = await updateBudgetFn(newBudget);
    // Directly check the result from the useFetch hook's fn
    if (result.success) {
      setIsEditModalOpen(false);
      setShowSuccess(true);
      toast.success("Budget updated successfully");
      setEditingBudget(result.data.amount.toString());
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setEditingBudget(initialBudget?.amount?.toString() || "");
    setError('');
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    if (updateError) {
      setError(updateError.message || "Failed to update budget");
      toast.error(updateError.message || "Failed to update budget");
    }
  }, [updateError]);

  // Update editing budget when initialBudget changes
  useEffect(() => {
    if (initialBudget?.amount) {
      setEditingBudget(initialBudget.amount.toString());
    }
  }, [initialBudget?.amount]);

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'from-red-500 to-red-600';
    if (percentage >= 80) return 'from-yellow-500 to-yellow-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Conditionally render either the "No Budget Set" state or the main card */}
      {!initialBudget ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/20">
              <IndianRupee className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-xl font-heading font-semibold text-foreground">No Budget Set</h3>
              <p className="text-muted-foreground">Set up your monthly budget to track spending</p>
            </div>
            <motion.button
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Set Budget
            </motion.button>
          </div>
        </motion.div>
      ) : (
        /* Main Budget Card */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col mt-7 items-center lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Budget Info */}
            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <motion.div
                  className={`p-3 rounded-xl ${status.bg}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StatusIcon className={`w-6 h-6 ${status.color}`} />
                </motion.div>
                <div className="text-center lg:text-left mt-7 sm:mt-7 md:mt-0">
                  <h3 className="text-xl font-heading font-semibold text-foreground">Monthly Budget</h3>
                  <p className="text-muted-foreground">
                    {isOverBudget ? 'Over budget' : isNearLimit ? 'Near limit' : 'On track'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
                <div className="space-y-1 text-center">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-semibold text-foreground">{formatCurrency(data.total)}</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-2xl font-semibold text-red-400">{formatCurrency(data.spent)}</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className={`text-2xl font-semibold ${data.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(data.remaining)}
                  </p>
                </div>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/30"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className={`bg-gradient-to-r ${getProgressColor(spentPercentage)}`}
                  style={{
                    strokeDasharray: `${2 * Math.PI * 50}`,
                    stroke: spentPercentage >= 100 ? '#ef4444' : spentPercentage >= 80 ? '#eab308' : '#22c55e',
                  }}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - Math.min(spentPercentage, 100) / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.p
                    className="text-3xl font-bold text-foreground"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                  >
                    {Math.round(spentPercentage)}%
                  </motion.p>
                  <p className="text-xs text-muted-foreground">spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <motion.button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Edit Modal (single instance) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card border border-border rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-foreground">
                  {initialBudget ? 'Edit Budget' : 'Set Monthly Budget'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monthly Budget Amount
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={editingBudget}
                      onChange={(e) => setEditingBudget(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground text-sm sm:text-base"
                      placeholder="Enter budget amount"
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {error}
                    </motion.p>
                  )}
                </div>

                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-border text-foreground hover:bg-muted/20 transition-colors text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleSaveBudget}
                    disabled={isLoading}
                    className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      'Save Budget'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
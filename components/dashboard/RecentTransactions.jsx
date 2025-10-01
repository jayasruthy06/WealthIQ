"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Minus, Search, Filter, ChevronDown, Eye } from 'lucide-react';
import { categoryColors } from '@/data/category';

const RecentTransactions = ({ transactions }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Add this inside the RecentTransactions component
useEffect(() => {
  setIsVisible(true);
}, []);

  const filteredTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Shopping': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Transport': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Salary': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Investment': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Bills': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Healthcare': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      'Entertainment': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="h-6 bg-muted animate-pulse rounded w-48"></div>
          <div className="h-10 bg-muted animate-pulse rounded w-full sm:w-32"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-xl animate-pulse">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 sm:w-32"></div>
                  <div className="h-3 bg-muted rounded w-16 sm:w-24"></div>
                </div>
              </div>
              <div className="h-5 bg-muted rounded w-16 sm:w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6 relative overflow-hidden transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-heading font-semibold text-foreground">Recent Transactions</h3>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className={`text-center py-8 sm:py-12 transition-all duration-700 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h4 className="text-base sm:text-lg font-medium text-foreground mb-2">No transactions found</h4>
            <p className="text-sm sm:text-base text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`group flex items-center justify-between p-3 sm:p-4 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border/50 hover:border-border transition-all duration-500 ease-out hover:shadow-lg hover:shadow-primary/5 cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: `${300 + index * 100}ms`
                }}
              >
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Transaction Icon */}
                  <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${
                    transaction.type === 'INCOME' 
                      ? 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30' 
                      : 'bg-red-500/20 text-red-400 group-hover:bg-red-500/30'
                  }`}>
                    {transaction.type === 'INCOME' ? <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> : <Minus className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                      <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200 text-sm sm:text-base truncate">
                        {transaction.description}
                      </h4>
                      <span style={{background: `${categoryColors[transaction.category]}20`,
                                    borderColor: categoryColors[transaction.category],
                                    color: categoryColors[transaction.category]
                                }}
                                className="border capitalize font-xs px-3 py-1 rounded-full">
                        {transaction.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {formatDate(transaction.date)}
                      {transaction.account && <span className="ml-2 text-primary/70 hidden sm:inline">• {transaction.account}</span>}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <div className={`font-semibold transition-all duration-200 group-hover:scale-105 text-sm sm:text-base ${transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {filteredTransactions.length > 0 && (
          <div className={`pt-4 border-t border-border/50 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDelay: `${300 + filteredTransactions.length * 100 + 200}ms`
          }}>
            <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group text-sm sm:text-base">
              <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">View All Transactions</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { RecentTransactions };
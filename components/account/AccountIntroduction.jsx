"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AccountIntroduction = ({ account }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      className="w-full px-6 py-8 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto mt-20">
        {/* Account Header */}
        <motion.div className="mb-4" variants={itemVariants}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2 capitalize">
                <span className="text-primary">{account.name}</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-heading font-semibold text-foreground">
                {formatCurrency(parseFloat(account.balance))}
              </div>
              <div className="text-muted-foreground">
                {account._count?.transactions} Transactions
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default AccountIntroduction;
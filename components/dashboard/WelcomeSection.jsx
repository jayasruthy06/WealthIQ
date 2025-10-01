"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, IndianRupeeIcon } from 'lucide-react';

export const WelcomeSection = ({username, accountSummary}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (rate) => `${rate.toFixed(1)}%`;

  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const dateStr = date.toLocaleDateString('en-IN', options);
    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(currentDateTime);

  const metrics = [
    {
      title: 'Total Balance',
      value: formatCurrency(accountSummary?.balance || 0),
      icon: IndianRupeeIcon,
      gradient: 'from-purple-500/20 via-purple-400/10 to-transparent',
      border: 'border-purple-500/20',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(accountSummary?.totalIncome || 0),
      icon: TrendingUp,
      gradient: 'from-green-500/20 via-green-400/10 to-transparent',
      border: 'border-green-500/20',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(accountSummary?.totalExpenses || 0),
      icon: TrendingDown,
      gradient: 'from-red-500/20 via-red-400/10 to-transparent',
      border: 'border-red-500/20',
    },
    {
      title: 'Savings Rate',
      value: formatPercentage(accountSummary?.savingsRate || 0),
      icon: PiggyBank,
      gradient: 'from-yellow-500/20 via-yellow-400/10 to-transparent',
      border: 'border-yellow-500/20',
    },
  ];

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.section
      className="w-full px-6 py-8 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mx-auto">
        {/* Welcome Header */}
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Welcome back, <span className="text-primary">{username}</span>
              </h1>
              <p className="text-muted-foreground text-lg">Here's your financial overview for today</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-heading font-semibold text-foreground">{timeStr}</div>
              <div className="text-muted-foreground">{dateStr}</div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6" variants={containerVariants}>
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                variants={cardVariants}
                whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
                className={`relative overflow-hidden rounded-xl bg-card border ${metric.border} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-50`} />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                   
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{metric.title}</p>
                    <p className="text-2xl font-heading font-bold text-foreground">{metric.value}</p>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} blur-xl`} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </div>
    </motion.section>
  );
};

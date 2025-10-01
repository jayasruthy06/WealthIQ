"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Download, Eye, Percent } from "lucide-react";

const ExpenseChart = ({ expenses }) => {
  const [viewMode, setViewMode] = useState("amount");
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate total
  const totalAmount = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

  // Map percentages
  const chartData = expenses.map((expense, index) => ({
    ...expense,
    percentage: totalAmount > 0 ? ((expense.amount / totalAmount) * 100).toFixed(1) : 0,
    index,
  }));

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{data.category}</p>
          <p className="text-primary font-semibold">{formatCurrency(data.amount)}</p>
          <p className="text-muted-foreground text-sm">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="flex flex-wrap gap-3 justify-center mt-0">
      {chartData.map((entry, index) => (
        <div
          key={entry.category}
          className="flex items-center gap-2 text-sm cursor-pointer transition-opacity hover:opacity-80"
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-foreground">{entry.category}</span>
          <span className="text-muted-foreground">
            {viewMode === "amount"
              ? formatCurrency(entry.amount)
              : `${entry.percentage}%`}
          </span>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <TrendingUp className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No expense data</h3>
      <p className="text-muted-foreground">Start tracking your expenses to see the breakdown here.</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-card via-card to-card/50 rounded-xl border border-border/50 shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-gradient-to-br from-card via-card to-card/50 rounded-xl border border-border/50 shadow-lg p-6">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br mt-10 from-card via-card to-card/50 rounded-xl border border-border/50 shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-1">
            Monthly Expenses
          </h2>
          <p className="text-muted-foreground text-sm">Breakdown by category for this month</p>
        </div>

        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button
            onClick={() =>
              setViewMode(viewMode === "amount" ? "percentage" : "amount")
            }
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm text-foreground"
          >
            {viewMode === "amount" ? (
              <Percent className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {viewMode === "amount" ? "Show %" : "Show ₹"}
          </button>

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm text-primary">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 mb-6 border border-primary/20">
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-1">Total Monthly Expenses</p>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={140}
              paddingAngle={2}
              dataKey="amount"
              animationBegin={0}
              animationDuration={800}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeIndex === index ? "#9b8cff" : "transparent"}
                  strokeWidth={activeIndex === index ? 3 : 0}
                  style={{
                    filter:
                      activeIndex !== null && activeIndex !== index
                        ? "opacity(0.6)"
                        : "none",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{chartData.length}</p>
            <p className="text-muted-foreground text-sm">Categories</p>
          </div>
        </div>
      </div>

      <CustomLegend />
    </div>
  );
};

export { ExpenseChart };

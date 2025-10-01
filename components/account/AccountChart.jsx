"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

export default function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const filteredData = useMemo(() => {
  const range = DATE_RANGES[dateRange];
  const now = new Date();
  const startDate = range.days
    ? startOfDay(subDays(now, range.days))
    : startOfDay(new Date(0));

  // Filter transactions within date range
  const filtered = transactions.filter(
    (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
  );

  const grouped = filtered.reduce((acc, transaction) => {
    const day = startOfDay(new Date(transaction.date)); // reliable Date
    const key = day.toISOString(); // group by ISO

    if (!acc[key]) {
      acc[key] = { 
        date: day,  // keep Date object
        income: 0, 
        expense: 0 
      };
    }
    if (transaction.type === "INCOME") {
      acc[key].income += Number(transaction.amount);
    } else {
      acc[key].expense += Number(transaction.amount);
    }
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => a.date - b.date) // ✅ sort by actual Date
    .map(d => ({
      ...d,
      date: format(d.date, "MMM dd"), // format AFTER sorting
    }));
}, [transactions, dateRange]);


  // Calculate totals for the selected period
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  const netAmount = totals.income - totals.expense;

  return (
    <div className="space-y-6">
      
      {/* Enhanced Chart Card */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl shadow-primary/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 p-6 border-b border-border/50 bg-muted/20">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-foreground">Transaction Overview</h3>
            <p className="text-sm text-muted-foreground">
              Visualizing your financial activity over {DATE_RANGES[dateRange].label.toLowerCase()}
            </p>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] bg-[#393a40] border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 hover:bg-[#393a40]/70">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-md border-border/50 rounded-xl shadow-xl">
              {Object.entries(DATE_RANGES).map(([key, { label }]) => (
                <SelectItem 
                  key={key} 
                  value={key} 
                  className="text-white focus:bg-primary/10 focus:text-primary transition-colors"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7 pl-10 pr-10 md:pl-4 md:pr-4">
        {/* Income Card */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Total Income</p>
              <p className="text-2xl font-bold md:text-xl text-green-500 transition-all duration-300 group-hover:scale-105">
                ₹{totals.income.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-xl border border-green-500/30 group-hover:bg-green-500/30 transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-green-500 md:h-4 md:w-4" />
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
              <p className="text-2xl font-bold md:text-xl text-red-500 transition-all duration-300 group-hover:scale-105">
                ₹{totals.expense.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30 group-hover:bg-red-500/30 transition-all duration-300">
              <TrendingDown className="h-6 w-6 text-red-500 md:h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Net Card */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Net Amount</p>
              <p className={`text-2xl font-bold md:text-xl transition-all duration-300 group-hover:scale-105 ${
                netAmount >= 0 ? "text-green-500" : "text-red-500"
              }`}>
                ₹{netAmount.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-xl border transition-all duration-300 ${
              netAmount >= 0 
                ? "bg-green-500/20 border-green-500/30 group-hover:bg-green-500/30" 
                : "bg-red-500/20 border-red-500/30 group-hover:bg-red-500/30"
            }`}>
              <DollarSign className={`h-6 w-6 md:h-4 md:w-4 ${
                netAmount >= 0 ? "text-green-500" : "text-red-500"
              }`} />
            </div>
          </div>
        </div>
      </div>

        <div className="p-6">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted/20 p-4 rounded-full mb-4">
                <BarChart className="h-12 w-12 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Data Available</h3>
              <p className="text-muted-foreground max-w-sm">
                No transactions found for the selected time period. Try adjusting the date range.
              </p>
            </div>
          ) : (
            <div className="h-[350px] relative">
              <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent pointer-events-none z-10 rounded-lg" />
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  className="transition-all duration-300"
                >
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={1}
                  />
                  
                  <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    className="transition-all duration-300"
                  />
                  
                  <YAxis
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                    className="transition-all duration-300"
                  />
                  
                  <Tooltip
                    formatter={(value, name) => [
                      `₹${Number(value).toFixed(2)}`, 
                      name === 'income' ? 'Income' : 'Expense'
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: "rgba(23, 24, 29, 0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      outline: "none",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                      borderRadius: "12px",
                      backdropFilter: "blur(12px)",
                      color: "#ffffff",
                      fontSize: "14px",
                    }}
                    labelStyle={{
                      color: "#a1a1aa",
                      fontSize: "12px",
                      marginBottom: "8px"
                    }}
                    cursor={{ 
                      fill: 'rgba(255,255,255,0.05)',
                      stroke: 'rgba(255,255,255,0.1)',
                      strokeWidth: 1,
                      radius: 8
                    }}
                  />
                  
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px',
                      color: '#ffffff'
                    }}
                    iconType="rect"
                  />
                  
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="url(#incomeGradient)"
                    radius={[6, 6, 0, 0]}
                    stroke="#22c55e"
                    strokeWidth={1}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                  
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="url(#expenseGradient)"
                    radius={[6, 6, 0, 0]}
                    stroke="#ef4444"
                    strokeWidth={1}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
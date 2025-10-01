"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { generateAIInsights } from "@/actions/transactions";

export default function AIInsights({ transactions }) {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const result = await generateAIInsights(transactions);
        setInsights(result);
      } catch (err) {
        console.error("Failed to generate AI insights:", err);
        setInsights([
          "Your highest expense category this month might need attention.",
          "Consider setting up a budget for better financial management.",
          "Track your recurring expenses to identify potential savings.",
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    if (transactions && transactions.length > 0) {
      fetchInsights();
      console.log(insights);
    } else {
      setInsights(["No transactions available for insights."]);
      setIsLoading(false);
    }
  }, [transactions]);

  return (
    <div className="w-full mx-auto text-sm">
      <div className="relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-gray-600/30 shadow-lg">
        {/* Glass reflection effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <Lightbulb
                className={`w-5 h-5 text-yellow-400 transition-all duration-500 ${
                  isLoading ? "animate-pulse" : "animate-bounce"
                }`}
              />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-gray-300 bg-clip-text text-transparent">
              AI Insights
            </h2>
          </div>

          {/* Content */}
          <div className="min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                <p className="text-gray-300 text-lg animate-pulse">
                  Working on it...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-purple-200/10 hover:border-purple-300/20 transition-all duration-300 hover:bg-white/10 transform hover:scale-[1.02] opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <p className="text-gray-200 leading-relaxed text-xs sm:text-sm">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

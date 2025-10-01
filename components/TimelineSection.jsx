"use client"

import { motion } from "framer-motion"
import { UserPlus, TrendingDown, BarChart3 } from "lucide-react"

const timelineSteps = [
  {
    number: 1,
    title: "Create Your Account",
    description: "Sign up in seconds and connect your bank accounts securely",
    icon: UserPlus,
  },
  {
    number: 2,
    title: "Track Your Spending",
    description: "Automatically categorize transactions and monitor your expenses",
    icon: TrendingDown,
  },
  {
    number: 3,
    title: "Get Insights",
    description: "Receive personalized insights and recommendations to save money",
    icon: BarChart3,
  },
]

export default function TimelineSection({ className = "", currentStep = 2 }) {
  const processedSteps = timelineSteps.map((step) => ({
    ...step,
    isActive: step.number === currentStep,
    isCompleted: step.number < currentStep,
  }))

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Timeline */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between relative">
          {processedSteps.map((step, index) => (
            <motion.div
              key={step.number}
              className="flex flex-col items-center relative z-10 flex-1"
              initial={{ opacity: 0.3, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "brightness(1.2)",
              }}
              transition={{
                duration: 0.6,
                delay: 1.5 + index * 0.4,
                ease: "easeOut",
              }}
            >
              {/* Step Indicator */}
              <div className="relative mb-6">
                <motion.div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-card border-primary/20 text-muted-foreground"
                  initial={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-card)",
                    color: "var(--color-muted-foreground)",
                    scale: 0.9,
                  }}
                  animate={{
                    borderColor: "var(--color-primary)",
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                    scale: 1,
                    boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5 + index * 0.4,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <step.icon className="w-6 h-6" />
                </motion.div>

                {/* Brightening Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary opacity-0"
                  animate={{
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 1.5 + index * 0.4,
                    ease: "easeOut",
                  }}
                />
              </div>

              {/* Step Content */}
              <div className="text-center max-w-xs">
                <motion.h3
                  className="text-lg font-semibold font-heading mb-2 text-muted-foreground"
                  initial={{ color: "var(--color-muted-foreground)" }}
                  animate={{ color: "var(--color-foreground)" }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5 + index * 0.4,
                    ease: "easeOut",
                  }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground/70"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5 + index * 0.4,
                    ease: "easeOut",
                  }}
                >
                  {step.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden space-y-6">
        {processedSteps.map((step, index) => (
          <motion.div
            key={step.number}
            className="relative"
            initial={{ opacity: 0.3, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "brightness(1.2)",
            }}
            transition={{
              duration: 0.6,
              delay: 1.5 + index * 0.4,
              ease: "easeOut",
            }}
          >
            <div className="flex items-start gap-4">
              {/* Step Indicator */}
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center bg-card text-muted-foreground"
                  initial={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-card)",
                    color: "var(--color-muted-foreground)",
                    scale: 0.9,
                  }}
                  animate={{
                    borderColor: "var(--color-primary)",
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                    scale: 1,
                    boxShadow: "0 0 15px rgba(147, 51, 234, 0.3)",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5 + index * 0.4,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <step.icon className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-8">
                <motion.div
                  className="p-4 rounded-lg border bg-card/50 border-border"
                  initial={{
                    backgroundColor: "rgba(var(--color-card) / 0.5)",
                    borderColor: "var(--color-border)",
                  }}
                  animate={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "rgba(var(--color-primary) / 0.2)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 1.5 + index * 0.4,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -2 }}
                >
                  <motion.h3
                    className="text-lg font-semibold font-heading mb-2 text-muted-foreground"
                    initial={{ color: "var(--color-muted-foreground)" }}
                    animate={{ color: "var(--color-foreground)" }}
                    transition={{
                      duration: 0.5,
                      delay: 1.5 + index * 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    className="text-sm text-muted-foreground/70"
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.5 + index * 0.4,
                      ease: "easeOut",
                    }}
                  >
                    {step.description}
                  </motion.p>
                </motion.div>
              </div>
            </div>

            {/* Brightening Glow Effect (Mobile) */}
            <motion.div
              className="absolute left-2 top-2 w-8 h-8 rounded-full bg-primary opacity-0 pointer-events-none"
              animate={{
                opacity: [0, 0.4, 0],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 0.8,
                delay: 1.5 + index * 0.4,
                ease: "easeOut",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

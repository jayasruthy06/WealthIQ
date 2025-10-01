"use client"

import { motion } from 'framer-motion'

const StatCard = ({ number, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group relative bg-card hover:bg-card/80 transition-all duration-300 rounded-lg p-6 border border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
  >
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2 group-hover:scale-105 transition-transform duration-300">
        {number}
      </div>
      <div className="text-sm md:text-base text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
        {description}
      </div>
    </div>
    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
  </motion.div>
)

const stats = [
  { number: "50k+", description: "Active Users" },
  { number: "$2B+", description: "Transactions Tracked" },
  { number: "99.9%", description: "Uptime" },
  { number: "4.9/5", description: "User Rating" }
]

export default function StatsSection({ className }) {
  return (
    <section className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.description}
            number={stat.number}
            description={stat.description}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

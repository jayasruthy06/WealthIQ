import {
  BarChart3,
  ScanLine,
  Target,
  CreditCard,
  Globe,
  Lightbulb
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get deep insights into your spending patterns with interactive charts and detailed financial reports."
  },
  {
    icon: ScanLine,
    title: "Smart Receipt Scanner",
    description: "Automatically capture and categorize expenses by scanning receipts with AI-powered recognition."
  },
  {
    icon: Target,
    title: "Budget Planning",
    description: "Set and track budgets across categories with intelligent alerts and personalized recommendations."
  },
  {
    icon: CreditCard,
    title: "Multi-Account Support",
    description: "Connect all your bank accounts and credit cards for a unified view of your finances."
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Track expenses in multiple currencies with real-time exchange rates and conversion."
  },
  {
    icon: Lightbulb,
    title: "Automated Insights",
    description: "Receive personalized financial insights and suggestions to optimize your spending habits."
  }
]

export default function FeaturesSection({ className }) {
  return (
    <section className={className}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-card border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 group"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

/**
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {string} profession
 * @property {string} quote
 * @property {string} [avatar]
 */

const defaultTestimonials = [
  {
    id: "1",
    name: "Sarah Chen",
    profession: "Financial Advisor",
    quote:
      "This platform has revolutionized how I manage my client portfolios. The insights are incredibly valuable and the interface is intuitive. My clients love the transparency it provides.",
  },
  {
    id: "2",
    name: "Marcus Thompson",
    profession: "Small Business Owner",
    quote:
      "As a restaurant owner, tracking expenses and revenue was always a headache. This tool simplified everything and gave me the financial clarity I needed to grow my business.",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    profession: "Investment Manager",
    quote:
      "The real-time analytics and reporting features are game-changers. I can make informed decisions faster and my team stays aligned with our investment strategies.",
  },
  {
    id: "4",
    name: "David Park",
    profession: "Startup Founder",
    quote:
      "From seed funding to Series A, this platform helped me keep track of our burn rate and runway. The forecasting tools were essential for our funding conversations.",
  },
]

function TestimonialCard({ testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="group bg-card border-border hover:border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-12 w-12 ring-2 ring-border group-hover:ring-primary/20 transition-colors">
            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-foreground text-base mb-1">
              {testimonial.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              {testimonial.profession}
            </p>
          </div>
          <Quote className="h-5 w-5 text-primary/60 flex-shrink-0 mt-1" />
        </div>

        <blockquote className="text-foreground/90 leading-relaxed">
          "{testimonial.quote}"
        </blockquote>
      </CardContent>
    </Card>
  )
}

export default function TestimonialsSection({
  className = "",
  testimonials = defaultTestimonials,
}) {
  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            What our users say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from professionals who trust our platform to manage their
            finances and grow their businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

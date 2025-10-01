import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import StatsSection from "@/components/StatsSection"
import FeaturesSection from "@/components/FeaturesSection"
import TimelineSection from "@/components/TimelineSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import CTASection from "@/components/CTASection"
import Footer from "@/components/Footer"

export default function HomePage() {
 
  return (
    <div className="min-h-screen bg-background">
      
      <main>
        <HeroSection />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <StatsSection />
        </div>

        <div id="features" className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 lg:mb-16">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to take control of your finances and make smarter investment decisions.
              </p>
            </div>
          </div>
          <FeaturesSection />
        </div>

        <div className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get started in three simple steps and begin your journey to financial intelligence.
              </p>
            </div>
            <TimelineSection />
          </div>
        </div>

        <div id="testimonials">
          <TestimonialsSection />
        </div>

        <CTASection className="bg-gradient-to-b from-background to-muted/20" />
      </main>

      <Footer />
    </div>
  )
}
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export default function Footer({ className }) {
  return (
    <footer className={`bg-background border-t border-border ${className}`}>
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
              WealthIQ
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Empowering your financial journey with intelligent insights and comprehensive wealth management solutions.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4">
              <Link
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-secondary transition-colors duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-secondary transition-colors duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-secondary transition-colors duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-secondary transition-colors duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <nav className="space-y-3">
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Portfolio
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Analytics
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Reports
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Settings
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Legal
            </h4>
            <nav className="space-y-3">
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Terms & Conditions
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Cookie Policy
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Disclaimer
              </Link>
              <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors duration-200">
                Security
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h4 className="font-heading text-lg font-semibold text-foreground mb-4">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-muted-foreground">
                  <p className="leading-relaxed text-muted-foreground hover:text-primary transition-colors duration-200">
                    12th Floor, Sigma Towers,<br />
                    Outer Ring Road, Bellandur,<br />
                    Bengaluru, Karnataka – 560103, India
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Link href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  +91 98765 43210
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <Link href="mailto:contact@wealthiq.com" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  contact@wealthiq.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} WealthIQ. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Built with precision for your financial success.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

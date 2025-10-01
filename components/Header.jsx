"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Testimonials", href: "#testimonials" },
];

export default function Header({user}) {
  //await checkUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all duration-200 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center">
              <div className="font-heading text-xl font-bold text-foreground">
                <span className="text-primary">Wealth</span>IQ
              </div>
            </div>

            {/* Desktop Navigation (only for signed out users) */}
            <SignedOut>
              <nav className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-sm px-2 py-1"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </SignedOut>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <SignedOut>
                <Link href="/sign-in">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-white text-primary-foreground hover:bg-[#E1E0E5] transition-all duration-200 hover:scale-105">
                    Sign Up
                  </Button>
                </Link>
              </SignedOut>

              <SignedIn>
                {/* New buttons for signed in users */}
                <Link href="/dashboard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/transaction/create">
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Add Transaction
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-sm"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-50 h-full w-80 bg-card border-l border-border shadow-xl md:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header with UserButton + Logo */}
                <div className="flex items-center justify-between p-6 border-b border-border relative">
                  {/* User button on left */}
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                  {/* Logo in center */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 font-heading text-xl font-bold text-foreground">
                    <span className="text-primary">Wealth</span>IQ
                  </div>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card rounded-sm"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-8">
                  <div className="space-y-6">
                    <SignedOut>
                      {navigation.map((item, index) => (
                        <motion.a
                          key={item.name}
                          href={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.1 }}
                          onClick={closeMobileMenu}
                          className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {item.name}
                        </motion.a>
                      ))}
                    </SignedOut>

                    <SignedIn>
                      <motion.a
                        href="/dashboard"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={closeMobileMenu}
                        className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        Dashboard
                      </motion.a>
                      <motion.a
                        href="/transactions/new"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={closeMobileMenu}
                        className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        Add Transaction
                      </motion.a>
                    </SignedIn>
                  </div>
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="p-6 border-t border-border">
                  <SignedOut>
                    <div className="space-y-5">
                      <Link href="/sign-in" onClick={closeMobileMenu}>
                        <Button className="w-full mb-3 bg-primary text-primary-foreground hover:bg-primary/90">
                          Login
                        </Button>
                      </Link>
                      <Link href="/sign-up" onClick={closeMobileMenu}>
                        <Button className="w-full bg-white text-primary-foreground hover:bg-[#E1E0E5]">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </SignedOut>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

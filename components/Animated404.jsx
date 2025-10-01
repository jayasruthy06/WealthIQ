// components/Animated404.js
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function Animated404() {
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <div className="relative z-10">
      <motion.h1
        className="text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold font-heading leading-none"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        404
      </motion.h1>

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 text-foreground">
        Page Not Found
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
        Let&apos;s get you back on track with your wealth management journey.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
        <Link href="/">
          <Button size="lg">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
        </Link>
        <Button variant="outline" size="lg" onClick={handleGoBack}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
}

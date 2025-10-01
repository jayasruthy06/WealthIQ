// app/not-found.js
"use client";

import Footer from "@/components/Footer";
import Animated404 from "@/components/Animated404";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="container max-w-4xl mx-auto text-center">
          <Animated404 />
        </div>
      </main>
      <Footer />
    </div>
  );
}

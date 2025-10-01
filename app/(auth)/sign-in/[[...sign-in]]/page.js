"use client";

import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="flex items-center bg-background justify-center w-full min-h-screen">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
        localization={{
          signIn: {
            start: {
              title: "Welcome Back!",
              subtitle: "Login to your WealthIQ account",
            },
          },
        }}
        appearance={{
          variables: {
            colorPrimary: "#9b8cff",
            colorPrimaryForeground: "#0b0c10",
          },
          elements: {
            formButtonPrimary:
              "bg-primary text-primary-foreground hover:bg-primary/90",
          },
        }}
      />
    </div>
  );
};

export default Page;

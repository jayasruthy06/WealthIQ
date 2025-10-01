import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className="flex items-center bg-background justify-center w-full min-h-screen">
        <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            redirectUrl='/dashboard'
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
  )
}

export default page
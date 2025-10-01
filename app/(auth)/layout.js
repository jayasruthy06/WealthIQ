import { ClerkProvider } from "@clerk/nextjs";

export default function AuthLayout({ children }) {
  return (
    <ClerkProvider>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {children}
      </div>
    </ClerkProvider>
  );
}

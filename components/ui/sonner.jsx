"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      offset={16}
      gap={8}
      visibleToasts={5}
      style={{
        // Base toast styles
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        
        // Success toast (using your green chart color)
        "--success-bg": "var(--success)",
        "--success-text": "var(--success-foreground)",
        "--success-border": "var(--success)",
        
        // Error toast (using your existing destructive color)
        "--error-bg": "var(--destructive)",
        "--error-text": "var(--destructive-foreground)",
        "--error-border": "var(--destructive)",
        
        // Warning toast
        "--warning-bg": "var(--warning)",
        "--warning-text": "var(--warning-foreground)",
        "--warning-border": "var(--warning)",
        
        // Info toast
        "--info-bg": "var(--info)",
        "--info-text": "var(--info-foreground)",
        "--info-border": "var(--info)",
      }}
      toastOptions={{
        style: {
          borderRadius: '12px',
          fontSize: '14px',
          padding: '16px',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'var(--font-sans)',
        },
        className: 'custom-toast',
        duration: 4000,
      }}
      {...props} 
    />
  );
}

export { Toaster }
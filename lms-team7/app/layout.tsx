import "./globals.css";
import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-[var(--color-bg)] text-[var(--color-text)]" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

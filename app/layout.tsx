// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import AuthSessionProvider from "@/providers/Authprovider"
// import { ClientToaster } from "@/components/client-" // <== wrap Toaster here
import { ClientToaster } from "@/components/client-toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WMC Dashboard",
  description: "Wellness Management Center Dashboard",
  icons:{
    icon:"/middleNavLogo.svg"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthSessionProvider>
            {children}
            <ClientToaster />
          </AuthSessionProvider>
        </Providers>
      </body>
    </html>
  )
}

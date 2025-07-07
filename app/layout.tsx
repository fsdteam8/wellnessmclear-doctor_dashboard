import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import AuthSessionProvider from "@/providers/Authprovider"
import { Toaster } from "sonner"
// import AuthProvider from "@/components/provider/AuthProvider"
// import { Sidebar } from "@/components/sidebar"
// import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WMC Dashboard",
  description: "Wellness Management Center Dashboard",
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
            <Toaster/>
          </AuthSessionProvider>
        </Providers>
      </body>
    </html>
  )
}

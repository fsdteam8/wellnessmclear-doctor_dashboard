import type React from "react"
import type { Metadata } from "next"
// import { Inter } from "next/font/google"
import "../globals.css"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

// const inter = Inter({ subsets: ["latin"] })

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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

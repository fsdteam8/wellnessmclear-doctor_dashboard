"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, History, Wallet, Settings, LogOut } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Booking History", href: "/dashboard/booking-history", icon: History },
  { name: "My Wallet", href: "/dashboard/my-wallet", icon: Wallet },
  { name: "Setting", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#2F3E34] min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-white text-xl font-bold">WMC</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 pb-6">
        <ul className="space-y-4">
          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href)

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-4 text-sm font-medium rounded-lg transition-colors",
                    isActive ? "bg-[#A8C2A3] text-white" : "text-white/80 hover:bg-[#A8C2A3] hover:text-white",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-[#5A6D33] hover:text-white rounded-lg transition-colors w-full">
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  )
}

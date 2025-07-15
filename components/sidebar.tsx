"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  History,
  Wallet,
  Settings,
  LogOut,
  Settings2,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

const navigation = [
  { id: 1, name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: 2, name: "Booking History", href: "/dashboard/booking-history", icon: History },
  { id: 3, name: "My Wallet", href: "/dashboard/my-wallet", icon: Wallet },
  { id: 4, name: "Setting", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)

  const setUpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/onboard`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Onboarding failed")
      }

      const data = await response.json()
      return data
    },
    onSuccess: (res) => {
      const url = res?.data?.url
      if (url) {
        toast.success("Redirecting to Stripe onboarding...")
        setOpen(false)
        window.location.href = url 
      } else {
        toast.error(res.message || "Stripe URL not found.")
      }
    },
    onError: (error) => {
      console.error("Onboarding failed:", error)
      toast.error(error.message || "Something went wrong")
    },
  })

  const handleSubmit = () => {
    if (!email) {
      toast.error("Please enter a valid email.")
      return
    }
    setUpMutation.mutate(email)
  }

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
            const isActive = item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href)

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-4 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-[#A8C2A3] text-white"
                      : "text-white/80 hover:bg-[#A8C2A3] hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}

          {/* Setup opens modal */}
          <li>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-3 px-3 py-4 text-sm font-medium text-white/80 hover:bg-[#A8C2A3] hover:text-white rounded-lg w-full text-left"
            >
              <Settings2 className="h-4 w-4" />
              Setup
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-[#5A6D33] hover:text-white rounded-lg transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={setUpMutation.isPending}
            >
              {setUpMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

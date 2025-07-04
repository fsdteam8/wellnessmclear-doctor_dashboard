"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function PersonalInformation() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  })

  if (isLoading) {
    return (
      <div className="py-10 px-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setting</h1>
        <p className="text-sm text-gray-500">
          Dashboard {">"} Setting {">"} Personal Information
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
              <AvatarFallback className="text-lg font-semibold">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.fullName}</h2>
            </div>
          </div>
          <Link href="/dashboard/settings/personal-information/edit">
            <Button className="bg-green-600 hover:bg-green-700">Update Profile</Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={user.fullName} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled className="bg-gray-50" />
          </div>
        </div>
      </div>
    </div>
  )
}

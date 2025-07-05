"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function PersonalInformation() {
  // const TOKEN = session?.data?.user?.accessToken;
  const session = useSession();
  const users = session?.data?.user;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  })
  console.log(users)

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
              <AvatarImage src={users?.profileImage || "/placeholder.svg"} alt={users?.firstName} />
              <AvatarFallback className="text-lg font-semibold">
                {users?.firstName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{users?.firstName} {users?.lastName}</h2>
            </div>
          </div>
          <Link href="/dashboard/settings/personal-information/edit">
            <Button className="bg-green-600 hover:bg-green-700">Update Profile</Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input id="firstname" value={users?.firstName} disabled className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input id="lastname" value={users?.lastName} disabled className="bg-gray-50" />
          </div>


          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={users?.email} disabled className="bg-gray-50" />
          </div>
        </div>
      </div>
    </div>
  )
}

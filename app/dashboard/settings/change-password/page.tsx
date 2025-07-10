"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
// import { useRouter } from "next/navigation"
import * as z from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
// import { toast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { CoachResponse } from "@/types/profiledatatype"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

export default function ChangePassword() {
  const { data: session } = useSession()

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const users = session?.user;

  const { data } = useQuery<CoachResponse>({
    queryKey: ["user", users?.id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/${users?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${users?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!users?.id,
  });

  const user = data?.data;

  const passwordMutation = useMutation<unknown, Error, PasswordFormData>({
    mutationFn: async (data: PasswordFormData) => {
      const token = session?.user?.accessToken

      const payload = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const response = await res.json()
      if (!res.ok || !response?.status) {
        throw new Error(response?.message || "Failed to update password")
      }

      return response.data
    },
    onSuccess: (data) => {
      reset()
      const response = data as { message?: string }
      toast.success(response.message || "Password changed successfully")
      // router.push("/settings")
    },
    onError: (err: Error) => {
      console.log(err)
      toast.success("Failed to change password")
    },
  })

  const onSubmit = (data: PasswordFormData) => {
    console.log("Password change submitted:", {
      ...data,
      currentPassword: "***",
      newPassword: "***",
      confirmPassword: "***",
    })
    passwordMutation.mutate(data)
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleCancel = () => {
    // router.push("/settings")
  }

  return (
    <div className="py-10 px-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setting</h1>
        <p className="text-sm text-gray-500">
          Dashboard {">"} Setting {">"} Personal Information
        </p>
      </div>

      <div className=" rounded-lg p-6">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.profileImage} alt={user?.firstName} />
            <AvatarFallback className="text-lg font-semibold">{user?.firstName?.charAt(1)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            {/* <p className="text-gray-500">#raja123</p> */}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-6">Change Password</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    {...register("currentPassword")}
                    className={errors.currentPassword ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => togglePasswordVisibility("current")}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    {...register("newPassword")}
                    className={errors.newPassword ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={passwordMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={passwordMutation.isPending}>
                {passwordMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

"use client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { fetchUserProfile, updateUserProfile } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  userName: z.string().min(3, "Username must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function EditPersonalInformation() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: user, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  })

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      router.push("/settings/personal-information")
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    console.log("Profile form data:", data)
    updateMutation.mutate(data)
  }

  const handleCancel = () => {
    router.push("/dashboard/settings/personal-information")
  }

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
          <Button className="bg-green-600 hover:bg-green-700">Update Profile</Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} className={errors.fullName ? "border-red-500" : ""} />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">User Name</Label>
              <Input id="userName" {...register("userName")} className={errors.userName ? "border-red-500" : ""} />
              {errors.userName && <p className="text-sm text-red-500">{errors.userName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={watch("gender")} onValueChange={(value) => setValue("gender", value)}>
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                {...register("dateOfBirth")}
                placeholder="DD/MM/YYYY"
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
              {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} className={errors.address ? "border-red-500" : ""} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

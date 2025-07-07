"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import * as z from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/hooks/use-toast";
import { SessionUser } from "@/types/session";
import { UserResponse } from "@/types/profiledatatype";

// Zod schema update for dob as a date string in ISO format (YYYY-MM-DD)
const profileSchema = z.object({
  firstName: z.string().min(2, "Full name must be at least 2 characters"),
  lastName: z.string().min(3, "User name must be at least 3 characters"),
  phoneNumber: z.string().nullable().optional(),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      // Validate valid date format yyyy-mm-dd and that it's a real date
      const date = new Date(val);
      if (Number.isNaN(date.getTime())) return false;

      // Optional: disallow future dates
      const today = new Date();
      if (date > today) return false;

      return /^\d{4}-\d{2}-\d{2}$/.test(val);
    }, {
      message: "Invalid date of birth",
    }),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditPersonalInformation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userSession = session?.user as SessionUser;

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dob: "",
      address: "",
    },
  });

  const { data, isLoading } = useQuery<UserResponse>({
    queryKey: ["user", userSession?.id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userSession.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userSession.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!userSession?.id,
  });

  const user = data?.data;

  useEffect(() => {
    if (user) {
      // Normalize dob to YYYY-MM-DD for input type="date"
      let dobValue = "";
      if (user.dob) {
        const d = new Date(user.dob);
        if (!isNaN(d.getTime())) {
          dobValue = d.toISOString().substring(0, 10);
        }
      }

      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        dob: dobValue,
        address: user.address || "",
      });

      if (user.profileImage) {
        setPreviewAvatar(user.profileImage);
      }
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const token = session?.user?.accessToken;
      const userId = session?.user?.id;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok || !response?.status) {
        throw new Error(response?.message || "Failed to update profile");
      }

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["user", userSession?.id] });
      router.push("/dashboard/settings/personal-information");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const token = session?.user?.accessToken;

      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-avatar/${userSession?.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.status) {
        throw new Error(data.message || "Failed to update avatar");
      }

      return data.data;
    },
    onSuccess: () => {
      toast({ title: "Avatar updated" });
      queryClient.invalidateQueries({ queryKey: ["user", userSession?.id] });
      setSelectedAvatarFile(null);
      setPreviewAvatar(null);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    router.push("/dashboard/settings/personal-information");
  };

  if (!userSession || isLoading) return null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setting</h1>
        <p className="text-sm text-gray-500">
          Dashboard {">"} Setting {">"} Personal Information
        </p>
      </div>

      <div className=" rounded-lg  p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col mb-5 gap-4">
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedAvatarFile(file);
                  setPreviewAvatar(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
            <div
              className="cursor-pointer"
              onClick={() => document.getElementById("avatarInput")?.click()}
            >
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={previewAvatar || user?.profileImage || "/placeholder.svg"}
                  alt={user?.firstName || "User"}
                />
                <AvatarFallback>
                  {user?.firstName?.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <Button
              type="button"
              variant="default"
              className="w-fit"
              onClick={() => {
                if (selectedAvatarFile) {
                  avatarMutation.mutate(selectedAvatarFile);
                } else {
                  toast({ title: "Please select an image first." });
                }
              }}
              disabled={avatarMutation.isPending}
            >
              {avatarMutation.isPending ? "Uploading..." : "Update Avatar"}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Full Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
            </div>


            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              {/* Modern date input */}
              <Input
                id="dob"
                type="date"
                {...register("dob")}
              // placeholder removed, date input doesn't need it
              />
              {errors.dob && <p className="text-sm text-red-500">{errors.dob.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email} disabled />
            {/* {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>} */}
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
  );
}

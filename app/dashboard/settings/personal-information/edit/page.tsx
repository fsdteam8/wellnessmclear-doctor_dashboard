"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Upload, Plus, Calendar } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";

// Type definitions
interface SessionUser {
  id: string;
  accessToken: string;
  email?: string;
  name?: string;
}

interface Skill {
  skillName: string;
  description: string;
}

interface AvailabilitySlot {
  startTime: string;
  endTime: string;
}

interface Availability {
  day: string;
  slots: AvailabilitySlot[];
}

interface Certification {
  name: string;
}

interface Service {
  _id: string;
  title: string;
}

interface CoachData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  specialization?: string;
  description?: string;
  qualification?: string;
  fieldOfExperiences?: string;
  yearsOfExperience?: number;
  servicesOffered?: Service;
  skills?: Skill[];
  availability?: Availability[];
  certifications?: Certification[];
}

interface CoachResponse {
  status: boolean;
  message: string;
  data: CoachData;
}

// Form data type
interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  specialization: string;
  description: string;
  qualification: string;
  fieldOfExperiences: string;
  yearsOfExperience: string;
  servicesOffered: string;
  skills: Skill[];
  availability: Availability[];
  certifications: Certification[];
}

// Utility to normalize time format
const normalizeTime = (time: string): string => {
  if (!time) return "";
  if (/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(time)) return time;
  const hour = parseInt(time, 10);
  if (isNaN(hour) || hour < 0 || hour > 23) return "";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${formattedHour.toString().padStart(2, "0")}:00 ${period}`;
};

export default function EditPersonalInformation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userSession = session?.user as SessionUser | undefined;

  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [certificationFiles, setCertificationFiles] = useState<File[]>([]);
  const [certificationFilesPreview, setCertificationFilesPreview] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      gender: "",
      specialization: "",
      description: "",
      qualification: "",
      fieldOfExperiences: "",
      yearsOfExperience: "",
      servicesOffered: "",
      skills: [{ skillName: "", description: "" }],
      availability: [{ day: "", slots: [{ startTime: "", endTime: "" }] }],
      certifications: [{ name: "" }],
    },
    resolver: async (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errors: any = {};
      const values = { ...data };

      // Validate availability slots for AM/PM
      values.availability.forEach((avail, index) => {
        avail.slots.forEach((slot, slotIndex) => {
          const startTime = slot.startTime?.trim();
          const endTime = slot.endTime?.trim();

          if (startTime && !/^\d{1,2}:\d{2}\s(AM|PM)$/i.test(startTime)) {
            if (!errors.availability) errors.availability = [];
            if (!errors.availability[index]) errors.availability[index] = { slots: [] };
            if (!errors.availability[index].slots[slotIndex]) errors.availability[index].slots[slotIndex] = {};
            errors.availability[index].slots[slotIndex].startTime = {
              type: "pattern",
              message: "Start time must include AM or PM (e.g., 10:20 AM)",
            };
          }

          if (endTime && !/^\d{1,2}:\d{2}\s(AM|PM)$/i.test(endTime)) {
            if (!errors.availability) errors.availability = [];
            if (!errors.availability[index]) errors.availability[index] = { slots: [] };
            if (!errors.availability[index].slots[slotIndex]) errors.availability[index].slots[slotIndex] = {};
            errors.availability[index].slots[slotIndex].endTime = {
              type: "pattern",
              message: "End time must include AM or PM (e.g., 10:20 PM)",
            };
          }
        });
      });

      return {
        values,
        errors: Object.keys(errors).length > 0 ? errors : {},
      };
    },
  });

  const { fields: skills, append: addSkill } = useFieldArray({
    control,
    name: "skills",
  });

  const { fields: availability, append: addAvailability, update: updateAvailability } = useFieldArray({
    control,
    name: "availability",
  });

  const { fields: certifications, append: addCertification } = useFieldArray({
    control,
    name: "certifications",
  });

  const { data, isLoading } = useQuery<CoachResponse>({
    queryKey: ["user", userSession?.id],
    queryFn: async () => {
      if (!userSession?.id) throw new Error("User session not available");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/${userSession.id}`, {
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

  const { data: servicesData } = useQuery<{ data: Service[] }>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!userSession?.accessToken) throw new Error("User session not available");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/service/all-services`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userSession.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
    enabled: !!userSession?.id,
  });

  const user = data?.data;

  useEffect(() => {
    if (user) {
      const dob = user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "";
      const years = user.yearsOfExperience ? user.yearsOfExperience.toString() : "";
      const genderValue = user.gender && ["male", "female", "other"].includes(user.gender.toLowerCase())
        ? user.gender.toLowerCase()
        : "";

      reset({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phoneNumber: user?.phoneNumber || "",
        dateOfBirth: dob,
        address: user?.address || "",
        gender: genderValue,
        specialization: user?.specialization || "",
        description: user?.description || "",
        qualification: user?.qualification || "",
        fieldOfExperiences: user?.fieldOfExperiences || "",
        yearsOfExperience: years,
        servicesOffered: user?.servicesOffered?._id ? user?.servicesOffered._id.toString() : "",
        skills: user?.skills?.length ? user?.skills : [{ skillName: "", description: "" }],
        availability: user?.availability?.length
          ? user?.availability.map((avail) => ({
            day: avail?.day || "",
            slots: avail?.slots?.length
              ? avail?.slots.map((slot) => ({
                startTime: normalizeTime(slot.startTime) || "",
                endTime: normalizeTime(slot.endTime) || "",
              }))
              : [{ startTime: "", endTime: "" }],
          }))
          : [{ day: "", slots: [{ startTime: "", endTime: "" }] }],
        certifications: user.certifications?.length ? user.certifications : [{ name: "" }],
      });

      if (user.profileImage) {
        setPreviewAvatar(user.profileImage);
      }
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      if (formData.phoneNumber) submitData.append("phoneNumber", formData.phoneNumber);
      submitData.append("dateOfBirth", formData.dateOfBirth);
      submitData.append("address", formData.address);
      if (formData.gender) submitData.append("gender", formData.gender);
      if (formData.specialization) submitData.append("specialization", formData.specialization);
      if (formData.description) submitData.append("description", formData.description);
      if (formData.qualification) submitData.append("qualification", formData.qualification);
      if (formData.fieldOfExperiences) submitData.append("fieldOfExperiences", formData.fieldOfExperiences);
      if (formData.yearsOfExperience) submitData.append("yearsOfExperience", parseInt(formData.yearsOfExperience).toString());
      if (formData.servicesOffered) submitData.append("servicesOffered", formData.servicesOffered);
      if (formData.skills?.length) submitData.append("skills", JSON.stringify(formData.skills));
      if (formData.availability?.length) submitData.append("availability", JSON.stringify(formData.availability));
      if (formData.certifications?.length) {
        const certificationsText = formData.certifications.map(cert => cert.name).join(", ");
        submitData.append("certifications", certificationsText);
      }
      certificationFiles.forEach((file) => submitData.append("certificationFiles", file));

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/${userSession!.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userSession!.accessToken}`,
        },
        body: submitData,
      });

      const response = await res.json();
      if (!res.ok || !response?.status) {
        throw new Error(response?.message || "Failed to update profile");
      }
      return response.data;
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["user", userSession?.id] });
      router.push("/dashboard/settings/personal-information");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/${userSession!.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userSession!.accessToken}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || !result.status) throw new Error(result.message || "Avatar upload failed");
      return result.data;
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
        description: err.message || "Failed to upload avatar",
        variant: "destructive",
      });
    },
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: `${file.name} is not a supported image type.`, variant: "destructive" });
        return;
      }
      if (file.size > maxSize) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB.`, variant: "destructive" });
        return;
      }
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificationFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: `${file.name} is not a supported file type.`, variant: "destructive" });
        return false;
      }
      if (file.size > maxSize) {
        toast({ title: "File too large", description: `${file.name} exceeds 5MB.`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setCertificationFiles(validFiles);
    setCertificationFilesPreview([]);
    validFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCertificationFilesPreview((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        setCertificationFilesPreview((prev) => [...prev, file.name]);
      }
    });
  };

  const addSlot = (availabilityIndex: number) => {
    updateAvailability(availabilityIndex, {
      ...availability[availabilityIndex],
      slots: [...(availability[availabilityIndex].slots || []), { startTime: "", endTime: "" }],
    });
  };

  const handleCancel = () => {
    router.push("/dashboard/settings/personal-information");
  };

  const onSubmit = (formData: FormData) => {
    updateMutation.mutate(formData);
  };

  if (!userSession || isLoading) return null;

  return (
    <div className="bg-white w-full rounded-lg shadow-sm p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Dashboard {">"} Settings {">"} Personal Information</p>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-6 mb-6">
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
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
                onError={() => setPreviewAvatar("/placeholder.svg")}
              />
              <AvatarFallback>
                {user?.firstName?.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              if (selectedAvatarFile) avatarMutation.mutate(selectedAvatarFile);
              else toast({ title: "Please select an image first." });
            }}
            disabled={avatarMutation.isPending}
            className="bg-[#A8C2A3] cursor-pointer hover:bg-[#7ba772] text-white h-12"
          >
            {avatarMutation.isPending ? "Uploading..." : "Update Avatar"}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
              <Input id="firstName" {...register("firstName")} className="h-12 border-gray-300" />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input id="lastName" {...register("lastName")} className="h-12 border-gray-300" />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} className="h-12 border-gray-300" />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input id="email" value={user?.email || ""} disabled className="h-12 border-gray-300" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      console.log("Gender changed to:", value);
                    }}
                  >
                    <SelectTrigger className="h-12 w-full border-gray-300">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">Date Of Birth</Label>
              <div className="relative">
                <Input
                  type="date"
                  {...register("dateOfBirth")}
                  className="h-12 pr-10 border-gray-300"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
              <Input id="address" {...register("address")} className="h-12 border-gray-300" />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">Specialization Area</Label>
              <Input
                {...register("specialization")}
                className="h-12 border-gray-300"
              />
              {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience" className="text-sm font-medium text-gray-700">Years Of Experience</Label>
              <Controller
                name="yearsOfExperience"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      console.log("Years of Experience changed to:", value);
                    }}
                  >
                    <SelectTrigger className="h-12 w-full border-gray-300">
                      <SelectValue placeholder="Select years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 50 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} {i + 1 === 1 ? "year" : "years"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.yearsOfExperience && <p className="text-red-500 text-sm">{errors.yearsOfExperience.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="servicesOffered" className="text-sm font-medium text-gray-700">Service</Label>
              <Controller
                name="servicesOffered"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-12 w-full border-gray-300">
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {servicesData?.data?.length ? (
                        servicesData.data.map((service) => (
                          <SelectItem key={service._id} value={service._id.toString()}>
                            {service.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={user?.servicesOffered?._id?.toString() || ""}>
                          {user?.servicesOffered?.title || "Unknown Service"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.servicesOffered && <p className="text-red-500 text-sm">{errors.servicesOffered.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                {...register("description")}
                className="min-h-[100px] border-gray-300 resize-none"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="qualification" className="text-sm font-medium text-gray-700">Qualification</Label>
              <Textarea
                {...register("qualification")}
                className="min-h-[100px] border-gray-300 resize-none"
              />
              {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fieldOfExperiences" className="text-sm font-medium text-gray-700">Field Of Experiences</Label>
              <Input
                {...register("fieldOfExperiences")}
                className="h-12 border-gray-300 w-full"
              />
              {errors.fieldOfExperiences && <p className="text-red-500 text-sm">{errors.fieldOfExperiences.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Skills</Label>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.id} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Skill Name"
                      {...register(`skills.${index}.skillName`)}
                      className="h-12 border-gray-300"
                    />
                    <Input
                      placeholder="Skill Description"
                      {...register(`skills.${index}.description`)}
                      className="h-12 border-gray-300"
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => addSkill({ skillName: "", description: "" })} className="w-full h-12">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Availability</Label>
              <div className="space-y-4">
                {availability.map((avail, index) => (
                  <div key={avail.id} className="space-y-2">
                    <Controller
                      name={`availability.${index}.day`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-12 border-gray-300">
                            <SelectValue placeholder="Select Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                              (day) => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {avail.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Input
                            placeholder="Start Time (e.g., 11:00 AM)"
                            {...register(`availability.${index}.slots.${slotIndex}.startTime`)}
                            className="h-12 border-gray-300"
                          />
                          {errors.availability?.[index]?.slots?.[slotIndex]?.startTime && (
                            <p className="text-red-500 text-sm">
                              {errors.availability[index].slots[slotIndex].startTime.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            placeholder="End Time (e.g., 01:00 PM)"
                            {...register(`availability.${index}.slots.${slotIndex}.endTime`)}
                            className="h-12 border-gray-300"
                          />
                          {errors.availability?.[index]?.slots?.[slotIndex]?.endTime && (
                            <p className="text-red-500 text-sm">
                              {errors.availability[index].slots[slotIndex].endTime.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSlot(index)}
                      className="w-full h-12"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Slot
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addAvailability({ day: "", slots: [{ startTime: "", endTime: "" }] })}
                  className="w-full h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Availability
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Certifications</Label>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={cert.id} className="space-y-2">
                    <Input
                      placeholder="Certification Name"
                      {...register(`certifications.${index}.name`)}
                      className="h-12 border-gray-300"
                    />
                  </div>
                ))}
                <Button
                  hidden
                  type="button"
                  variant="outline"
                  onClick={() => addCertification({ name: "" })}
                  className="w-full h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700">Certification Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Upload your certifications</p>
                <label className="inline-block mt-2 cursor-pointer text-blue-500 hover:underline">
                  Browse
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleCertificationFilesChange}
                    className="hidden"
                  />
                </label>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {certificationFilesPreview.map((preview, idx) =>
                    preview.startsWith("data:image") ? (
                      <Image
                        key={idx}
                        src={preview}
                        alt={`Certification Preview ${idx + 1}`}
                        width={100}
                        height={100}
                        className="object-cover rounded border"
                      />
                    ) : (
                      <div
                        key={idx}
                        className="text-sm text-gray-600 bg-gray-100 p-2 rounded border"
                      >
                        📄 {preview}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="h-12 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-[#A8C2A3] cursor-pointer hover:bg-[#a8c2a3dc] text-white h-12"
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
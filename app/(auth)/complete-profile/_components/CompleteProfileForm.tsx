"use client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Upload, Calendar } from "lucide-react"
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  gender: z.string(),
  dob: z.string(),
  specialization: z.string(),
  description: z.string().optional(),
  qualification: z.string().optional(),
  experienceField: z.string(),
  experienceYears: z.string(),
  availability: z.string(),
  service: z.string(),
  certifications: z.any().optional(),
  profileImage: z.any().optional(),
})

export default function CompleteProfileForm() {
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "",
      dob: "",
      specialization: "",
      description: "",
      qualification: "",
      experienceField: "",
      experienceYears: "",
      availability: "",
      service: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ["complete-profile"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const signupData = JSON.parse(localStorage.getItem("signupData") || "{}")
      const formData = new FormData()

      // Append signup data
      formData.append("firstName", signupData.firstName)
      formData.append("lastName", signupData.lastName)
      formData.append("email", signupData.email)
      formData.append("password", signupData.password)

      // Append new form fields
      for (const [key, value] of Object.entries(values)) {
        if (value instanceof FileList) {
          formData.append(key, value[0])
        } else {
          formData.append(key, value)
        }
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/complete-profile`, {
        method: "POST",
        body: formData,
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.status) {
        toast.success("Profile completed successfully!")
        localStorage.removeItem("signupData")
        router.push("/login")
      } else {
        toast.error(data.message || "Something went wrong!")
      }
    },
    onError: () => {
      toast.error("Failed to complete profile.")
    },
  })

interface CompleteProfileFormValues {
    gender: string
    dob: string
    specialization: string
    description?: string
    qualification?: string
    experienceField: string
    experienceYears: string
    availability: string
    service: string
    certifications?: FileList
    profileImage?: FileList
}

const onSubmit = (data: CompleteProfileFormValues) => {
    mutate(data)
}

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture */}
          <FormField
            name="profileImage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Profile Picture</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-3">Upload your image file</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="hidden"
                      id="profileImage"
                    />
                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Upload
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Gender</FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 text-gray-500">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            name="dob"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Date Of Birth</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="date"
                      {...field}
                      className="h-12 pr-10 text-gray-500"
                      placeholder="Select Date Of Birth"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Specialization Area */}
          <FormField
            name="specialization"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Specialization Area</FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 text-gray-500">
                    <SelectValue placeholder="Select Specialization Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Oncology">Oncology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Write something..." className="min-h-[120px] resize-none" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Qualification */}
          <FormField
            name="qualification"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Qualification</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Add qualifications..." className="min-h-[120px] resize-none" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Field Of Experience */}
          <FormField
            name="experienceField"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Field Of Experiences</FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 text-gray-500">
                    <SelectValue placeholder="Select Specialization Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oncology">Oncology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Years of Experience */}
          <FormField
            name="experienceYears"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Years Of Experience</FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 text-gray-500">
                    <SelectValue placeholder="Select Specialization Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="2">2 Years</SelectItem>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="4">4 Years</SelectItem>
                    <SelectItem value="5">5+ Years</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Availability */}
          <FormField
            name="availability"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Availability</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Write Time & Select Date" {...field} className="h-12 pr-10 text-gray-500" />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Service */}
          <FormField
            name="service"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Service</FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="h-12 text-gray-500">
                    <SelectValue placeholder="Select Service here" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Therapy">Therapy</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Certifications Upload */}
          <FormField
            name="certifications"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">Certifications</FormLabel>
                <FormControl>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-3">Upload your certifications file</p>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="hidden"
                      id="certifications"
                    />
                    <label
                      htmlFor="certifications"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Upload
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-8"
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

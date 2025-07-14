"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Plus, Calendar } from "lucide-react"
import Image from "next/image"
import type { BasicFormData, ProfessionalFormData } from "../page"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface ProfessionalInfoFormProps {
  basicData: BasicFormData
  onBack: () => void
}

interface Service {
  _id: number,
  title: string
}

export default function ProfessionalInfoForm({
  basicData,
  onBack,
}: ProfessionalInfoFormProps) {
  const [formData, setFormData] = useState<ProfessionalFormData>({
    profilePicture: null,
    gender: "",
    dateOfBirth: "",
    specialization: "",
    description: "",
    qualification: "",
    fieldOfExperiences: "",
    yearsOfExperience: "",
    availability: [],
    servicesOffered: "",
    skills: [],
    certificationsName: "",
    certifications: [],
  })

  const [timeErrors, setTimeErrors] = useState<{
    [key: string]: { startTime: string; endTime: string }
  }>({})

  const router = useRouter()

  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [certificationFilesPreview, setCertificationFilesPreview] = useState<string[]>([])

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/register`, {
        method: "POST",
        body: data,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Registration failed")
      }

      return response.json()
    },
    onSuccess: (res) => {
      toast.success(res.message)
      router.push("/login")
    },
    onError: (error: Error) => {
      // Using alert since toast was removed, but you could replace with another UI feedback method
      alert("Registration failed: " + error.message)
    },
  })

  const validateTimeFormat = (time: string): string => {
    if (!time) return ""
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i
    return timeRegex.test(time.trim()) ? "" : "Time must include AM/PM (e.g., 10:09 AM)"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all time inputs
    const newErrors: { [key: string]: { startTime: string; endTime: string } } = {}
    let hasErrors = false

    formData.availability.forEach((avail, index) => {
      avail.slots.forEach((slot, slotIndex) => {
        const errorKey = `${index}-${slotIndex}`
        const startTimeError = validateTimeFormat(slot.startTime)
        const endTimeError = validateTimeFormat(slot.endTime)
        newErrors[errorKey] = { startTime: startTimeError, endTime: endTimeError }
        if (startTimeError || endTimeError) {
          hasErrors = true
        }
      })
    })

    setTimeErrors(newErrors)
    if (hasErrors) return

    const submitData = new FormData()
    submitData.append("firstName", basicData.firstName)
    submitData.append("lastName", basicData.lastName)
    submitData.append("email", basicData.email)
    submitData.append("password", basicData.password)
    submitData.append("phoneNumber", basicData.phoneNumber)
    submitData.append("address", basicData.address)
    submitData.append("gender", formData.gender)
    submitData.append("dateOfBirth", formData.dateOfBirth)
    submitData.append("specialization", formData.specialization)
    submitData.append("description", formData.description)
    submitData.append("qualification", formData.qualification)
    submitData.append("fieldOfExperiences", formData.fieldOfExperiences)
    submitData.append("yearsOfExperience", formData.yearsOfExperience)
    submitData.append("servicesOffered", formData.servicesOffered)
    submitData.append("availability", JSON.stringify(formData.availability))
    submitData.append("skills", JSON.stringify(formData.skills))
    submitData.append("certifications", formData.certificationsName)

    if (formData.profilePicture) {
      submitData.append("profileImage", formData.profilePicture)
    }

    formData.certifications.forEach((file) => {
      submitData.append("certificationFiles", file)
    })

    submitMutation.mutate(submitData)
  }

  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/service/all-services`, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${users?.accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    // enabled: !!users?.id,
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }))
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSkillChange = (
    index: number,
    field: "skillName" | "description",
    value: string
  ) => {
    const newSkills = [...formData.skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    setFormData((prev) => ({ ...prev, skills: newSkills }))
  }

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { skillName: "", description: "" }],
    }))
  }

  const addAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: "", slots: [{ startTime: "", endTime: "" }] }],
    }))
  }

  const handleAvailabilityChange = (
    index: number,
    field: "day" | "slots",
    value: string | { startTime: string; endTime: string }[]
  ) => {
    const newAvailability = [...formData.availability]
    newAvailability[index] = { ...newAvailability[index], [field]: value }
    setFormData((prev) => ({ ...prev, availability: newAvailability }))
  }

  const addSlot = (availabilityIndex: number) => {
    const newAvailability = [...formData.availability]
    newAvailability[availabilityIndex].slots.push({ startTime: "", endTime: "" })
    setFormData((prev) => ({ ...prev, availability: newAvailability }))
  }

  return (
    <div className=" bg-white w-full rounded-lg shadow-sm p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <Label className="block mb-3 text-sm font-medium text-gray-700">
            Profile Picture
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt="Profile"
                className="w-20 h-20 mx-auto rounded-full object-cover mb-2"
                width={80}
                height={80}
              />
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload profile picture</p>
              </>
            )}
            <label className="inline-block mt-3 cursor-pointer text-blue-500 hover:underline">
              Browse image
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Gender */}
        <div>
          <Label className="mb-2 block text-sm font-medium text-gray-700">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
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
        </div>

        {/* Date of Birth */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Date Of Birth</Label>
          <div className="relative">
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
              className="h-12 pr-10 border-gray-300"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Specialization */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Specialization Area</Label>
          <Input
            value={formData.specialization}
            onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
            className="h-12 border-gray-300"
          />
        </div>

        {/* Description */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="min-h-[100px] border-gray-300 resize-none"
          />
        </div>

        {/* Qualification */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Qualification</Label>
          <Textarea
            value={formData.qualification}
            onChange={(e) => setFormData((prev) => ({ ...prev, qualification: e.target.value }))}
            className="min-h-[100px] border-gray-300 resize-none"
          />
        </div>

        {/* Field Of Experiences */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Field Of Experiences</Label>
          <Input
            value={formData.fieldOfExperiences}
            onChange={(e) => setFormData((prev) => ({ ...prev, fieldOfExperiences: e.target.value }))}
            className="h-12 border-gray-300 w-full"
          />
        </div>

        {/* Years Of Experience */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Years Of Experience</Label>
          <Select
            value={formData.yearsOfExperience}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, yearsOfExperience: value }))}
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
        </div>

        {/* Skills */}
        <div>
          <Label className="mb-2 block text-sm font-medium text-gray-700">Skills</Label>
          <div className="space-y-4">
            {formData.skills.map((skill, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Skill Name"
                  value={skill.skillName}
                  onChange={(e) => handleSkillChange(index, "skillName", e.target.value)}
                  className="h-12 border-gray-300"
                />
                <Input
                  placeholder="Skill Description"
                  value={skill.description}
                  onChange={(e) => handleSkillChange(index, "description", e.target.value)}
                  className="h-12 border-gray-300"
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSkill} className="w-full h-12">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </div>

        {/* Availability */}
        <div>
          <Label className="mb-2 block text-sm font-medium text-gray-700">Availability</Label>
          <div className="space-y-4">
            {formData.availability.map((avail, index) => (
              <div key={index} className="space-y-2">
                <Select
                  value={avail.day}
                  onValueChange={(value) => handleAvailabilityChange(index, "day", value)}
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
                {avail.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="Start Time (e.g., 11:00 AM)"
                        value={slot.startTime}
                        onChange={(e) => {
                          const newSlots = [...avail.slots]
                          newSlots[slotIndex] = { ...newSlots[slotIndex], startTime: e.target.value }
                          handleAvailabilityChange(index, "slots", newSlots)
                          setTimeErrors((prev) => ({
                            ...prev,
                            [`${index}-${slotIndex}`]: {
                              ...prev[`${index}-${slotIndex}`],
                              startTime: validateTimeFormat(e.target.value),
                            },
                          }))
                        }}
                        className={`h-12 border-gray-300 ${timeErrors[`${index}-${slotIndex}`]?.startTime ? 'border-red-500' : ''}`}
                      />
                      {timeErrors[`${index}-${slotIndex}`]?.startTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {timeErrors[`${index}-${slotIndex}`].startTime}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        placeholder="End Time (e.g., 01:00 PM)"
                        value={slot.endTime}
                        onChange={(e) => {
                          const newSlots = [...avail.slots]
                          newSlots[slotIndex] = { ...newSlots[slotIndex], endTime: e.target.value }
                          handleAvailabilityChange(index, "slots", newSlots)
                          setTimeErrors((prev) => ({
                            ...prev,
                            [`${index}-${slotIndex}`]: {
                              ...prev[`${index}-${slotIndex}`],
                              endTime: validateTimeFormat(e.target.value),
                            },
                          }))
                        }}
                        className={`h-12 border-gray-300 ${timeErrors[`${index}-${slotIndex}`]?.endTime ? 'border-red-500' : ''}`}
                      />
                      {timeErrors[`${index}-${slotIndex}`]?.endTime && (
                        <p className="text-red-500 text-sm mt-1">
                          {timeErrors[`${index}-${slotIndex}`].endTime}
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
            <Button type="button" variant="outline" onClick={addAvailability} className="w-full h-12">
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium text-gray-700">Service</Label>
          <Select
            value={formData.servicesOffered}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, servicesOffered: value }))}
          >
            <SelectTrigger className="h-12 w-full border-gray-300">
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              {data?.data?.map((service: Service, i: number) => (
                <SelectItem key={service._id || i} value={service._id.toString()}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Certifications */}
        <div>
          <Label className="block mb-3 text-sm font-medium text-gray-700">Certifications</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Upload your certifications</p>
            <label className="inline-block mt-2 cursor-pointer text-blue-500 hover:underline">
              Browse
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setFormData((prev) => ({ ...prev, certifications: files }))
                  setCertificationFilesPreview([]) // reset before new
                  files.forEach((file) => {
                    if (file.type.startsWith("image/")) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setCertificationFilesPreview((prev) => [...prev, event.target!.result as string])
                        }
                      }
                      reader.readAsDataURL(file)
                    } else {
                      setCertificationFilesPreview((prev) => [...prev, file.name])
                    }
                  })
                }}
                className="hidden"
              />
            </label>

            {/* Preview Section */}
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

        {/* Certifications Name */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Certifications Name</Label>
          <Input
            value={formData.certificationsName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, certificationsName: e.target.value }))
            }
            className="min-h-[50px] border-gray-300 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button type="button" variant="outline" onClick={onBack} className="">
            Back
          </Button>
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className=" bg-blue-500 hover:bg-blue-600 text-white "
          >
            {submitMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  )
}
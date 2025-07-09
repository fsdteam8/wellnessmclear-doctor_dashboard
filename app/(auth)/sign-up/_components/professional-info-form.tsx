"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
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
import type { BasicFormData, ProfessionalFormData } from "../page"
import Image from "next/image"

interface ProfessionalInfoFormProps {
  basicData: BasicFormData
  onBack: () => void
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
    availability: [
      {
        day: "Monday",
        slots: [
          { startTime: "11:00 AM", endTime: "01:00 PM" },
          { startTime: "03:00 PM", endTime: "06:00 PM" },
        ],
      },
      {
        day: "Wednesday",
        slots: [{ startTime: "10:00 AM", endTime: "02:00 PM" }],
      },
    ],
    servicesOffered: "6864cfe5898d9331b5424aa3",
    skills: [
      {
        skillName: "Nutrition Coaching",
        description: "Helping clients with diet and meal plans.",
      },
      {
        skillName: "Fitness Training",
        description: "Providing personalized fitness guidance.",
      },
    ],
    certifications: [],
  })

  const [profilePreview, setProfilePreview] = useState<string | null>(null)

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
    onSuccess: () => {
      alert("Registration successful!")
    },
    onError: (error) => {
      alert("Registration failed: " + error.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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

    if (formData.profilePicture) {
      submitData.append("profilePicture", formData.profilePicture)
    }

    formData.certifications.forEach((file) => {
      submitData.append("certifications", file)
    })

    submitMutation.mutate(submitData)
  }

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
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
            <SelectTrigger className="h-12 border-gray-300">
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
            className="h-12 border-gray-300"
          />
        </div>

        {/* Years Of Experience */}
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-700">Years Of Experience</Label>
          <Select
            value={formData.yearsOfExperience}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, yearsOfExperience: value }))}
          >
            <SelectTrigger className="h-12 border-gray-300">
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
                />
                <Input
                  placeholder="Skill Description"
                  value={skill.description}
                  onChange={(e) => handleSkillChange(index, "description", e.target.value)}
                />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSkill} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <Label className="block mb-3 text-sm font-medium text-gray-700">Certifications</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Upload your certifications</p>
            <label className="inline-block mt-2 cursor-pointer text-blue-500 hover:underline">
              Browse files
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  setFormData((prev) => ({ ...prev, certifications: files }))
                }}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onBack} className="w-full h-12">
            Back
          </Button>
          <Button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  )
}

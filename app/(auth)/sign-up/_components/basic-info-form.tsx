"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { BasicFormData } from "../page"
// import type { BasicFormData } from "@/app/page"

interface BasicInfoFormProps {
  onSubmit: (data: BasicFormData) => void
}

export default function BasicInfoForm({ onSubmit }: BasicInfoFormProps) {
  const [formData, setFormData] = useState<BasicFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: keyof BasicFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="text-center mb-8">
        <p className="text-gray-600 text-sm mb-2">Welcome to Wellness Made Clear</p>
        <h1 className="text-2xl font-semibold text-gray-900">Create an account</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Enter your name..."
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="mt-1 h-12 border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Enter your name..."
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="mt-1 h-12 border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your mail address..."
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="mt-1 h-12 border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
            Phone No <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter yourNumber..."
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            className="mt-1 h-12 border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="Enter your Address..."
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="mt-1 h-12 border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password..."
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="h-12 border-gray-300 rounded-md pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Password..."
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="h-12 border-gray-300 rounded-md pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the <span className="text-red-500 underline cursor-pointer">terms & conditions</span>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#A8C2A3] hover:bg-green-500 text-white font-medium rounded-md"
          disabled={!formData.agreeToTerms}
        >
          Continue
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account? <span className="text-blue-600 underline cursor-pointer">Log In</span>
          </p>
        </div>
      </form>
    </div>
  )
}

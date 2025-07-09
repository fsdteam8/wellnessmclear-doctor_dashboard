"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import BasicInfoForm from "./_components/basic-info-form"
import ProfessionalInfoForm from "./_components/professional-info-form"

const queryClient = new QueryClient()

export interface BasicFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface ProfessionalFormData {
  profilePicture: File | null
  gender: string
  dateOfBirth: string
  specialization: string
  description: string
  qualification: string
  fieldOfExperiences: string
  yearsOfExperience: string
  availability: Array<{
    day: string
    slots: Array<{
      startTime: string
      endTime: string
    }>
  }>
  servicesOffered: string
  skills: Array<{
    skillName: string
    description: string
  }>
  certifications: File[]
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [basicData, setBasicData] = useState<BasicFormData | null>(null)

  const handleBasicFormSubmit = (data: BasicFormData) => {
    setBasicData(data)
    setCurrentStep(2)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto">
          {currentStep === 1 ? (
            <BasicInfoForm onSubmit={handleBasicFormSubmit} />
          ) : (
            <ProfessionalInfoForm basicData={basicData!} onBack={handleBack} />
          )}
        </div>
      </div>
    </QueryClientProvider>
  )
}

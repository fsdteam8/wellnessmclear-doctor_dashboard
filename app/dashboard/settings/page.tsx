"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Settings() {
  return (
    <div className="py-10 px-12 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setting</h1>
        <p className="text-sm text-gray-500">Dashboard {">"} Setting</p>
      </div>

      {/* Settings Options */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-0 ">
            <Link href="/dashboard/settings/personal-information">
              <Button
                variant="ghost"
                className="w-full justify-between cursor-pointer p-4 h-auto font-medium text-left hover:bg-gray-50"
              >
                Personal Information
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Link href="/dashboard/settings/change-password">
              <Button
                variant="ghost"
                className="w-full cursor-pointer justify-between p-4 h-auto font-medium text-left hover:bg-gray-50"
              >
                Change Password
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

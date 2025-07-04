"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="bg-[#2F3E34] px-6 py-8 flex justify-end">
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-medium">Mr. Raja</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Mr. Raja" />
          <AvatarFallback className="bg-white text-[#4A5D23] text-xs font-medium">MR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

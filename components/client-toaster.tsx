"use client"

import { useEffect, useState } from "react"
import { Toaster } from "sonner"

export function ClientToaster() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <Toaster /> : null
}

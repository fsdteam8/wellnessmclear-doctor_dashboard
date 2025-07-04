import type { User, BookingRecord, WalletRecord, DashboardStats } from "./types"

// Mock API functions
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    totalRevenue: 32570,
    totalBooking: 132570,
    revenueRatio: [
      { date: "3 Oct", thisMonth: 5, lastMonth: 8 },
      { date: "10 Oct", thisMonth: 12, lastMonth: 15 },
      { date: "16 Oct", thisMonth: 8, lastMonth: 12 },
      { date: "20 Oct", thisMonth: 18, lastMonth: 10 },
      { date: "21 Oct", thisMonth: 15, lastMonth: 20 },
      { date: "27 Oct", thisMonth: 25, lastMonth: 18 },
      { date: "30 Oct", thisMonth: 20, lastMonth: 25 },
    ],
    bookingReport: {
      thisDay: 45,
      thisWeek: 320,
      thisMonth: 1250,
    },
    bookingSession: {
      categories: [
        { name: "Category name", percentage: 30, color: "#8B5CF6" },
        { name: "Category name", percentage: 25, color: "#06B6D4" },
        { name: "Category name", percentage: 20, color: "#10B981" },
        { name: "Category name", percentage: 25, color: "#F59E0B" },
      ],
    },
  }
}

export const fetchBookingHistory = async (): Promise<BookingRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return Array.from({ length: 12 }, (_, i) => ({
    id: `booking-${i + 1}`,
    serviceName: "Clarity Health Audit",
    userName: "John Smith",
    userAvatar: "/placeholder.svg?height=40&width=40",
    price: 150.0,
    coachName: "Den Jamison",
    startTime: "10:00am",
    endTime: "10:00am",
    date: "08/21/2025",
    status: i < 3 ? "Completed" : ("Pending" as "Completed" | "Pending"),
  }))
}

export const fetchWalletRecords = async (): Promise<WalletRecord[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  return Array.from({ length: 12 }, (_, i) => ({
    id: `wallet-${i + 1}`,
    serviceName: "Clarity Health Audit",
    clientName: "Wilamson",
    revenue: 620,
  }))
}

export const fetchUserProfile = async (): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: "user-1",
    fullName: "Mr. Raja",
    userName: "raja123",
    email: "raja123@gmail.com",
    phoneNumber: "+1 (888) 000-0000",
    dateOfBirth: "01/01/1990",
    gender: "Male",
    address: "00000 Artesia Blvd, Suite A-000",
    avatar: "/placeholder.svg?height=80&width=80",
  }
}

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Updating user profile:", data)

  const currentUser = await fetchUserProfile()
  return { ...currentUser, ...data }
}

export const changePassword = async (data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Changing password:", { ...data, currentPassword: "***", newPassword: "***", confirmPassword: "***" })

  if (data.newPassword !== data.confirmPassword) {
    throw new Error("Passwords do not match")
  }

  return { success: true }
}

export interface User {
  id: string
  fullName: string
  userName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: string
  address: string
  avatar: string
}

export interface BookingRecord {
  id: string
  serviceName: string
  userName: string
  userAvatar: string
  price: number
  coachName: string
  startTime: string
  endTime: string
  date: string
  status: "Completed" | "Pending" | "Cancelled"
}

export interface WalletRecord {
  id: string
  serviceName: string
  clientName: string
  revenue: number
}

export interface DashboardStats {
  totalRevenue: number
  totalBooking: number
  revenueRatio: Array<{ date: string; thisMonth: number; lastMonth: number }>
  bookingReport: {
    thisDay: number
    thisWeek: number
    thisMonth: number
  }
  bookingSession: {
    categories: Array<{ name: string; percentage: number; color: string }>
  }
}

export type CoachPaymentReportResponse = {
  totalPayments: number
  totalPlatformEarning: number
  totalCoachEarning: number
  payments: Payment[]
}

export type Payment = {
  paymentId: string
  totalAmount: number
  splitAmount: number
  coachEarning: number
  booking: Booking
}

export type Booking = {
  _id: string
  user: User
  coach: Coach
  service: Service
  payment: string
  date: string // ISO format
  availability: Availability[]
  status: string
  createdAt: string
  updatedAt: string
  __v: number
}

export type User = {
  _id: string
  firstName: string
  email: string
}

export type Coach = {
  _id: string
  firstName: string
  email: string
  profileImage: string
}

export type Service = {
  _id: string
  icon: string
  description: string
  price: number
  title:string

}

export type Availability = {
  day: string
  slots: Slot[]
}

export type Slot = {
  startTime: string
  endTime: string
}

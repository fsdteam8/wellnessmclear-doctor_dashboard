"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUp, Package } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CoachRevenueDay {
  date: string
  revenue: number
}
interface CoachRevenueWeek {
  week: string
  revenue: number
}
interface CoachRevenueMonth {
  month: string
  revenue: number
}

export default function Dashboard() {
  const session = useSession()
  const id = session.data?.user.id
  const [range, setRange] = useState<"day" | "week" | "month">("day")

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/coach/${id}/earnings`,
        {
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard stats")
      }

      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const totalRevenue = stats.summary.totalCoachEarning ?? 0
  const totalBooking = stats.summary.totalBookings ?? 0
  const newBookings = stats.summary.newBookings ?? {
    thisDay: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  }

  const getChartData = () => {
    if (range === "day") {
      return stats.coachRevenue.day.map((item: CoachRevenueDay) => ({
        label: item.date,
        revenue: item.revenue,
      }))
    }
    if (range === "week") {
      return stats.coachRevenue.week.map((item: CoachRevenueWeek) => ({
        label: item.week,
        revenue: item.revenue,
      }))
    }
    if (range === "month") {
      return stats.coachRevenue.month.map((item: CoachRevenueMonth) => ({
        label: item.month,
        revenue: item.revenue,
      }))
    }
    return []
  }

  const chartData = getChartData()

  const newBookingsData = [
    { name: "Today", value: newBookings.thisDay, fill: "#A8C2A3" },
    { name: "This Week", value: newBookings.thisWeek, fill: "#C6D2FD" },
    { name: "This Month", value: newBookings.thisMonth, fill: "#CBA0E3" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500">Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total Revenue</CardTitle>
            <TrendingUp className="h-10 w-10 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total Booking</CardTitle>
            <Package className="h-10 w-10 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalBooking}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Report */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Revenue Report</CardTitle>
            <div className="flex gap-2">
              {(["day", "week", "month"] as const).map((type) => (
                <Button
                  key={type}
                  variant={range === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRange(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`$${value}`, "Revenue"]}
                    labelFormatter={(label: string) => `${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8B5CF6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* New Booking Report */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle>New Booking Report</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="pb-0">
            <div className="flex justify-center ">
              <ResponsiveContainer width={320} height={300}>
                <RadialBarChart
                  innerRadius="30%"
                  outerRadius="100%"
                  data={newBookingsData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    label={{ position: "insideStart", fill: "#333", fontSize: 12 }}
                    background
                    dataKey="value"
                  />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      marginTop: 20,
                    }}
                  />
                  <Tooltip formatter={(value: number) => [`${value} bookings`, ""]} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

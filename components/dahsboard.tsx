"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
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

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500">Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Booking</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalBooking.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Ratio Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">My Revenue Ratio</CardTitle>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-600">This Month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-gray-600">Last Month</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.revenueRatio}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                  <Line
                    type="monotone"
                    dataKey="thisMonth"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="lastMonth"
                    stroke="#9CA3AF"
                    strokeWidth={2}
                    dot={{ fill: "#9CA3AF", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Report */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Total New Booking Report</CardTitle>
            <button className="text-sm text-blue-600 hover:underline">View Details</button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">This day</span>
                </div>
                <span className="font-semibold">{stats.bookingReport.thisDay}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">This Week</span>
                </div>
                <span className="font-semibold">{stats.bookingReport.thisWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">This Month</span>
                </div>
                <span className="font-semibold">{stats.bookingReport.thisMonth}</span>
              </div>
            </div>
            <div className="mt-6 h-32 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-gray-200"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-8 border-green-500 border-t-transparent animate-spin"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Session */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Booking Session</CardTitle>
            <button className="text-sm text-blue-600 hover:underline">View Details</button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {stats.bookingSession.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm text-gray-600">{category.name}</span>
                  </div>
                  <span className="font-semibold">{category.percentage}%</span>
                </div>
              ))}
            </div>
            <div className="h-32 flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-8 border-gray-200"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-8 border-purple-500 border-t-transparent"></div>
                <div className="absolute inset-2 w-20 h-20 rounded-full border-6 border-blue-500 border-t-transparent"></div>
                <div className="absolute inset-4 w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

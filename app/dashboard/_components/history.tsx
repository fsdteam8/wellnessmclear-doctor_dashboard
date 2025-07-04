"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchBookingHistory } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function BookingHistory() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["booking-history"],
    queryFn: fetchBookingHistory,
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10 px-12 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
        <p className="text-sm text-gray-500">Dashboard {">"} Booking History</p>
      </div>

      {/* Table */}
      <div className=" rounded-lg ">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-t">
              <TableHead className="font-semibold text-gray-900">Service Name</TableHead>
              <TableHead className="font-semibold text-gray-900">User Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Price</TableHead>
              <TableHead className="font-semibold text-gray-900">Coach Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Start Time</TableHead>
              <TableHead className="font-semibold text-gray-900">End Time</TableHead>
              <TableHead className="font-semibold text-gray-900">Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id} className="border-b">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-orange-400 rounded"></div>
                    </div>
                    <span className="font-medium">{booking.serviceName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={booking.userAvatar || "/placeholder.svg"} alt={booking.userName} />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <span>{booking.userName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">${booking.price.toFixed(2)}</TableCell>
                <TableCell>{booking.coachName}</TableCell>
                <TableCell>{booking.startTime}</TableCell>
                <TableCell>{booking.endTime}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={booking.status === "Completed" ? "default" : "secondary"}
                    className={
                      booking.status === "Completed"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                    }
                  >
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-600">Showing 1 to 5 of 12 results</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              ...
            </Button>
            <Button variant="outline" size="sm">
              8
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CoachPaymentReportResponse } from "@/types/walletDataType"
import Image from "next/image"

export default function BookingHistory() {
  const session = useSession()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const { data, isLoading } = useQuery<CoachPaymentReportResponse>({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/booking/earnings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.data?.user?.accessToken}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch earnings data")
      return res.json()
    },
    enabled: !!session.data?.user?.accessToken,
  })

  const totalItems = data?.payments.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentPayments = data?.payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || []

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (isLoading || !data) {
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
      <div className="rounded-lg">
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
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments.map(({ booking, paymentId }) => (
              <TableRow key={paymentId} className="border-b">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={booking.service.icon}
                        alt="Service Icon"
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <span className="font-medium">{booking.service.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={"/placeholder.svg"} alt={booking.user.firstName} />
                      <AvatarFallback>{booking.user.firstName?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{booking.user.firstName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">${booking.service.price.toFixed(2)}</TableCell>
                <TableCell>{booking.coach.firstName}</TableCell>
                <TableCell>{booking.availability[0]?.slots[0]?.startTime || "-"}</TableCell>
                <TableCell>{booking.availability[0]?.slots[0]?.endTime || "-"}</TableCell>
                {/* Fix date formatting to ISO string */}
                <TableCell>{booking.date ? booking.date.slice(0, 10) : "-"}</TableCell>
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
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(i + 1)}
                className={currentPage === i + 1 ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

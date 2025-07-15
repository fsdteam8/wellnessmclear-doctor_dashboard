
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CoachPaymentReportResponse } from "@/types/walletDataType"
import Image from "next/image"
import { toast } from "sonner"

export default function BookingHistory() {
  const { data: sessionData, status } = useSession()
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [openModal, setOpenModal] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [zoomLink, setZoomLink] = useState("")

  const { data, isLoading } = useQuery<CoachPaymentReportResponse>({
    queryKey: ["wallet"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/booking/earnings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData?.user?.accessToken}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch earnings data")
      return res.json()
    },
    enabled: status === "authenticated",
  })

  const approveBookingMutation = useMutation({
    mutationFn: async ({ bookingId, zoomLink }: { bookingId: string; zoomLink: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/booking/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData?.user?.accessToken}`,
        },
        body: JSON.stringify({ zoomLink, status: "Approved", })
      })
      if (!res.ok) throw new Error("Failed to approve booking")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Booking approved successfully")
      setOpenModal(false)
      setZoomLink("")
      setSelectedBookingId(null)
      queryClient.invalidateQueries({ queryKey: ["wallet"] })
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to approve booking")
    },
  })


  const payments = data?.payments || []
  const totalItems = payments.length
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1)
  const currentPayments = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleApproveClick = (bookingId: string) => {
    setSelectedBookingId(bookingId)
    setOpenModal(true)
  }

  const handleSubmit = () => {
    if (selectedBookingId && zoomLink.trim()) {
      approveBookingMutation.mutate({ bookingId: selectedBookingId, zoomLink })
    } else {
      toast.warning("Please provide a valid Zoom link")
    }
  }

  if (status === "loading" || isLoading || !data) {
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
        <p className="text-sm text-gray-500">Dashboard {">"} Booking History</p>
      </div>

      <div className="rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-t">
              <TableHead>Service Name</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Coach Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments.map(({ booking }, index) => (
              <TableRow key={booking?._id || `booking-row-${index}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={booking?.service?.icon || "https://placehold.co/600x400"}
                        alt="Service Icon"
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                      />
                    </div>
                    <span className="font-medium">{booking?.service?.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={"/placeholder.svg"} alt={booking?.user?.firstName} />
                      <AvatarFallback>{booking?.user?.firstName?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{booking?.user?.firstName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">${booking?.service?.price?.toFixed(2)}</TableCell>
                <TableCell>{booking?.coach?.firstName}</TableCell>
                <TableCell>{booking?.availability?.[0]?.slots?.[0]?.startTime || "-"}</TableCell>
                <TableCell>{booking?.availability?.[0]?.slots?.[0]?.endTime || "-"}</TableCell>
                <TableCell>{booking?.date ? booking?.date.slice(0, 10) : "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={booking?.status === "Approved" ? "default" : "secondary"}
                    className={
                      booking?.status === "Approved"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                    }
                  >
                    {booking?.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {booking?.status === "Approved" ? (
                    <Button size="sm" disabled className="cursor-not-allowed opacity-60 w-[100px]">
                      Approved
                    </Button>
                  ) : (
                    <Button size="sm" className="cursor-pointer w-[100px]" onClick={() => handleApproveClick(booking._id)}>
                      Approve
                    </Button>
                  )}
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
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNumber = i + 1
              return (
                <Button
                  key={`page-${pageNumber}`}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNumber)}
                  className={currentPage === pageNumber ? "bg-[#A8C2A3] cursor-pointer" : ""}
                >
                  {pageNumber}
                </Button>
              )
            })}
            <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Zoom Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="url"
              placeholder="Paste Zoom meeting link"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={approveBookingMutation.isPending}
            >
              {approveBookingMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

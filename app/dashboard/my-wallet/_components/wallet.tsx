"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CoachPaymentReportResponse } from "@/types/walletDataType"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"

export default function MyWallet() {
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

  if (isLoading || !data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const totalItems = data?.payments.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const currentPayments = data?.payments.slice(startIdx, startIdx + itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="px-12 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-sm text-gray-500">Dashboard {">"} Wallet</p>
        </div>
      </div>

      {/* Total Revenue Card */}
      <Card className="bg-gradient-to-r mb-8 from-[#6A93B6] to-[#6A93B6] text-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white/90">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${data.totalCoachEarning.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Wallet Records Table */}
      <div>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-t border-[#B6B6B6]">
              <TableHead className="font-semibold text-gray-900 py-4">Service</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Price</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Client</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPayments?.map((payment) => {
              if (!payment?.booking) return null
              const { service, user } = payment.booking

              return (
                <TableRow key={payment?.paymentId} className="border-b border-[#B6B6B6]">
                  <TableCell className="font-medium py-[30px] flex items-center gap-3">
                    <Image
                      src={service?.icon || "https://placehold.co/600x400"}
                      alt="Service Icon"
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                    <span>{service?.title}</span>
                  </TableCell>
                  <TableCell className="font-medium py-[30px]">
                    ${service?.price}
                  </TableCell>
                  <TableCell className="py-[30px] flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.firstName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user?.firstName}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium py-[30px]">
                    ${payment?.coachEarning?.toFixed(2)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-600">
            Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, totalItems)} of {totalItems} results
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
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={currentPage === pageNum ? "bg-[#A8C2A3] cursor-pointer " : ""}
                >
                  {pageNum}
                </Button>
              )
            })}
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

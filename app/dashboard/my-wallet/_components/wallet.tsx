"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchWalletRecords } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function MyWallet() {
  const { data: walletRecords, isLoading } = useQuery({
    queryKey: ["wallet-records"],
    queryFn: fetchWalletRecords,
  })

  const totalRevenue = walletRecords?.reduce((sum, record) => sum + record.revenue, 0) || 0

  if (isLoading) {
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

  return (
    <div className="px-12 py-10 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-sm text-gray-500">Dashboard {">"} wallet</p>
        </div>
        {/* <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Withdraw
        </Button> */}
      </div>

      {/* Total Revenue Card */}
      <Card className="bg-gradient-to-r mb-8 from-[#6A93B6] to-[#6A93B6] text-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white/90">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Wallet Records Table */}
      <div className="">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-t border-[#B6B6B6]">
              <TableHead className="font-semibold text-gray-900 py-4">Service Name</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4">Client Name</TableHead>
              <TableHead className="font-semibold text-gray-900 py-4 text-right">Revenue from Doctor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {walletRecords?.slice(0, 6).map((record) => (
              <TableRow key={record.id} className="border-b border-t border-[#B6B6B6]">
                <TableCell className="font-medium py-[30px]">{record.serviceName}</TableCell>
                <TableCell>{record.clientName}</TableCell>
                <TableCell className="text-right font-medium">${record.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-600">Showing 1 to 6 of 12 results</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
              1
            </Button>
            <Button variant="outline" size="sm">
              50
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

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "@/lib/api"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SkeletonCard } from "@/components/Skeletons"

interface PtoBalance {
  maxHours: number
  usedHours: number
  remainingHours: number
}

interface PtoRequest {
  id: number
  userId: number
  requestDate: string
  hours: number
  reason: string
  status?: string
}

export default function DashboardPage() {
  const [balance, setBalance] = useState<PtoBalance | null>(null)
  const [requests, setRequests] = useState<PtoRequest[]>([])
  const [error, setError] = useState("")
  // Loading indicator to manage skeletons
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        const headers = { Authorization: `Bearer ${token}` }
        const balanceRes = await api.get("/pto/balance", { headers })
        setBalance(balanceRes.data)

        const requestsRes = await api.get("/pto/requests", { headers })
        setRequests(requestsRes.data)
      } catch (err: any) {
        setError(err.response?.data?.error || "Unable to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  function getBadgeVariant(status?: string) {
    switch (status) {
      case "pending":
        return "secondary"
      case "approved":
        return "default"
      case "denied":
        return "destructive"
      default:
        return "outline"
    }
  }

  const sortedRequests = [...requests].sort(
    (a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
  )

  return (
    <div className="mx-auto w-full max-w-6xl pt-24 p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* If loading, show skeletons for the three cards. Otherwise show data */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : balance && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Max Hours</CardTitle>
              <CardDescription>Allotted PTO Hours</CardDescription>
            </CardHeader>
            <CardContent className="text-5xl font-bold">
              {balance.maxHours}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Used Hours</CardTitle>
              <CardDescription>How many used so far</CardDescription>
            </CardHeader>
            <CardContent className="text-5xl font-bold">
              {balance.usedHours}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Remaining</CardTitle>
              <CardDescription>Remaining PTO Hours</CardDescription>
            </CardHeader>
            <CardContent className="text-5xl font-bold">
              {balance.remainingHours}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-1xl font-bold">PTO Requests</h2>
        <Button asChild>
          <Link to="/new-request" className="hover:text-background">
            Submit New PTO Request
          </Link>
        </Button>
      </div>

      {/* If loading, show skeleton rows for requests. Otherwise show table data */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Date</TableHead>
            <TableHead className="w-[100px]">Hours</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? // Render a few skeleton rows
              [1, 2, 3, 4, 5].map((idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-[140px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                </TableRow>
              ))
            : sortedRequests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.requestDate}</TableCell>
                  <TableCell>{r.hours}</TableCell>
                  <TableCell>{r.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(r.status)} className="capitalize">
                      {r.status || "unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}

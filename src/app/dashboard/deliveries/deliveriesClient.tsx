"use client"

import { useEffect, useId, useState } from "react"
import { CalendarRange, Filter, MapPin, Package, Search } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { getAllDeliveries, updateDeliveryStatusInDB } from "@/app/actions/order-actions"

// Types for our delivery data
type DeliveryStatus = "pending" | "scheduled" | "in-progress" | "delivered" | "failed"

interface DeliveryDay {
  date: string
  status: DeliveryStatus
}

interface Delivery {
  id: string
  product_id: string
  user_id: string
  customer: {
    name: string
    address: string
    phone: string
  }
  product: string
  subscription: {
    start: string
    end: string
  }
  deliverystatus: DeliveryDay[]
  notes?: string
}

export default function DeliveryAgentPage() {
  // Sample delivery data
  const [deliveries, setDeliveries] = useState<Delivery[]>([])

  const [filter, setFilter] = useState<DeliveryStatus | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const toastId = useId()

  useEffect(()=> {
    async function fetchData() {
        const data = await getAllDeliveries()
        console.log(data.data);
        
        setDeliveries(data.data)
        // console.log(deliveries);
        
    }
    fetchData()
  }, [])

  // Helper function to determine the overall status of a delivery
  const getOverallStatus = (deliverystatus: DeliveryDay[]): DeliveryStatus => {
    if (deliverystatus.some((day) => day.status === "in-progress")) return "in-progress"
    if (deliverystatus.some((day) => day.status === "pending")) return "pending"
    if (deliverystatus.some((day) => day.status === "scheduled")) return "scheduled"
    if (deliverystatus.every((day) => day.status === "delivered")) return "delivered"
    if (deliverystatus.some((day) => day.status === "failed")) return "failed"
    return "scheduled"
  }

  // Filter deliveries based on status and search query
  const filteredDeliveries = deliveries.filter((delivery) => {
    const overallStatus = getOverallStatus(delivery.deliverystatus)
    const matchesStatus = filter === "all" || overallStatus === filter
    const matchesSearch =
      delivery.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // Update delivery status for a specific date
  const updateDeliveryDateStatus = async (id: string, date: string, newStatus: DeliveryStatus) => {
    try {
      let updatedStatus: DeliveryDay[] = []
  
      setDeliveries((prevDeliveries) => {
        const updated = prevDeliveries.map((delivery) => {
          if (delivery.id === id) {
            updatedStatus = delivery.deliverystatus.map((day) =>
              day.date === date ? { ...day, status: newStatus } : day
            )
            return { ...delivery, deliverystatus: updatedStatus }
          }
          return delivery
        })
        return updated
      })
  
      // Save the updated array to the database
      await updateDeliveryStatusInDB(id, updatedStatus)
  
      toast.success(`Delivery for ${date} status changed to ${newStatus}`, { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error("Failed to update delivery status")
    }
  }

  // Update all future delivery dates in a subscription
//   const updateAllFutureDeliveryStatus = (id: string, newStatus: DeliveryStatus) => {
//     const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format

//     setDeliveries((prevDeliveries) =>
//       prevDeliveries.map((delivery) => {
//         if (delivery.id === id) {
//           const updatedDeliveryStatus = delivery.deliveryStatus.map((day) => {
//             // Only update future or today's deliveries that aren't already delivered
//             const dayDate = new Date(day.date).toISOString().split("T")[0]
//             if (dayDate >= today && day.status !== "delivered") {
//               return { ...day, status: newStatus }
//             }
//             return day
//           })
//           return { ...delivery, deliveryStatus: updatedDeliveryStatus }
//         }
//         return delivery
//       }),
//     )

//     toast.warning(`All future deliveries for subscription ${id} changed to ${newStatus}`, {id: toastId})
//   }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Delivery Dashboard</h1>
            <p className="text-muted-foreground">Manage your assigned deliveries</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search deliveries..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={filter}
                  onValueChange={(value) => setFilter(value as DeliveryStatus | "all")}
                >
                  <DropdownMenuRadioItem value="all">All Deliveries</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="scheduled">Scheduled</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="delivered">Delivered</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="failed">Failed</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 md:w-fit">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="pending" onClick={() => setFilter("pending")}>
              Pending
            </TabsTrigger>
            <TabsTrigger value="scheduled" onClick={() => setFilter("scheduled")}>
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="in-progress" onClick={() => setFilter("in-progress")}>
              In Progress
            </TabsTrigger>
            <TabsTrigger value="delivered" onClick={() => setFilter("delivered")}>
              Delivered
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <DeliveryList
              deliveries={filteredDeliveries}
              updateDateStatus={updateDeliveryDateStatus}
            //   updateAllFutureStatus={updateAllFutureDeliveryStatus}
              getOverallStatus={getOverallStatus}
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-6">
            <DeliveryList
              deliveries={filteredDeliveries}
              updateDateStatus={updateDeliveryDateStatus}
            //   updateAllFutureStatus={updateAllFutureDeliveryStatus}
              getOverallStatus={getOverallStatus}
            />
          </TabsContent>
          <TabsContent value="scheduled" className="mt-6">
            <DeliveryList
              deliveries={filteredDeliveries}
              updateDateStatus={updateDeliveryDateStatus}
            //   updateAllFutureStatus={updateAllFutureDeliveryStatus}
              getOverallStatus={getOverallStatus}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <DeliveryList
              deliveries={filteredDeliveries}
              updateDateStatus={updateDeliveryDateStatus}
            //   updateAllFutureStatus={updateAllFutureDeliveryStatus}
              getOverallStatus={getOverallStatus}
            />
          </TabsContent>
          <TabsContent value="delivered" className="mt-6">
            <DeliveryList
              deliveries={filteredDeliveries}
              updateDateStatus={updateDeliveryDateStatus}
            //   updateAllFutureStatus={updateAllFutureDeliveryStatus}
              getOverallStatus={getOverallStatus}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface DeliveryListProps {
  deliveries: Delivery[]
  updateDateStatus: (id: string, date: string, status: DeliveryStatus) => void
//   updateAllFutureStatus: (id: string, status: DeliveryStatus) => void
  getOverallStatus: (deliverystatus: DeliveryDay[]) => DeliveryStatus
}

function DeliveryList({ deliveries, updateDateStatus, getOverallStatus }: DeliveryListProps) {
  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No deliveries found</h3>
        <p className="text-muted-foreground">Try changing your filters or check back later</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {deliveries.map((delivery) => (
        <DeliveryCard
          key={delivery.id}
          delivery={delivery}
          updateDateStatus={updateDateStatus}
        //   updateAllFutureStatus={updateAllFutureStatus}
          overallStatus={getOverallStatus(delivery.deliverystatus)}
        />
      ))}
    </div>
  )
}

interface DeliveryCardProps {
  delivery: Delivery
  updateDateStatus: (id: string, date: string, status: DeliveryStatus) => void
//   updateAllFutureStatus: (id: string, status: DeliveryStatus) => void
  overallStatus: DeliveryStatus
}

function DeliveryCard({ delivery, updateDateStatus, overallStatus }: DeliveryCardProps) {
    console.log(delivery);
    
    
  // Get the next pending or scheduled delivery
  const nextDelivery = delivery.deliverystatus.find(
    (day) => day.status === "pending" || day.status === "scheduled" || day.status === "in-progress",
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{delivery.product}</CardTitle>
            <p className="text-sm text-muted-foreground">{delivery.id}</p>
          </div>
          <StatusBadge status={overallStatus} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="font-medium">{delivery.customer.name}</p>
              <p className="text-sm text-muted-foreground">{delivery.customer.address}</p>
              <p className="text-sm text-muted-foreground">{delivery.customer.phone}</p>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              Subscription: {delivery.subscription.start} - {delivery.subscription.end}
            </span>
          </div>

          {nextDelivery && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Next Delivery:</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm">{nextDelivery.date}</p>
                <StatusBadge status={nextDelivery.status} />
              </div>
              <div className="mt-2">
                <Select
                  onValueChange={(value) => updateDateStatus(delivery.id, nextDelivery.date, value as DeliveryStatus)}
                  defaultValue={nextDelivery.status}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center">
            {/* <p className="text-sm font-medium">Update All Future Deliveries:</p> */}
            <Link href={`/dashboard/deliveries/view-details?delivery_id=${delivery.id}&product_id=${delivery.product_id}&user_id=${delivery.user_id}`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full border">
                View All
              </Button>
            </Link>
          </div>
          {/* <div className="flex gap-2 w-full">
            <Select onValueChange={(value) => updateAllFutureStatus(delivery.id, value as DeliveryStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Update all" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>
      </CardFooter>
    </Card>
  )
}

function StatusBadge({ status }: { status: DeliveryStatus }) {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    "in-progress": "bg-purple-100 text-purple-800 hover:bg-purple-100",
    delivered: "bg-green-100 text-green-800 hover:bg-green-100",
    failed: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const labels = {
    pending: "Pending",
    scheduled: "Scheduled",
    "in-progress": "In Progress",
    delivered: "Delivered",
    failed: "Failed",
  }

  return (
    <Badge className={variants[status]} variant="outline">
      {labels[status]}
    </Badge>
  )
}

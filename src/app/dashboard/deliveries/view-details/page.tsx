"use client"

import { useEffect, useId, useState } from "react"
import { ArrowLeft, CalendarRange, MapPin, Package, Phone, Truck, User } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"
import { getDeliveryByIds, updateDeliveryStatusInDB } from "@/app/actions/order-actions"

type DeliveryStatus = "pending" | "scheduled" | "in-progress" | "delivered" | "failed"

interface Delivery {
  data: {
    id: string
    product_id: string
    user_id: string
    customer: {
      name: string
      address: string
      phone: string
    }
    product: {
      name: string
      image: string
      price: number
    }
    quantity: number
    subscription: {
      start: string
      end: string
    }
    deliverystatus: Array<{
      date: string
      status: DeliveryStatus
    }>
    status: string
  }
  error: null | { message: string }
}

export default function DeliveryDetailsPage() {
  const toastId = useId()
  const searchParams = useSearchParams()
    const delivery_id = searchParams.get("delivery_id")
    const product_id = searchParams.get("product_id")
    const user_id = searchParams.get("user_id")

    console.log(delivery_id);
    
  const [delivery, setDelivery] = useState<Delivery | null>(null)

  
  useEffect(()=> {
    async function fetchData() {
      if (!delivery_id || !product_id || !user_id) return;
      
      const result = await getDeliveryByIds(delivery_id, product_id, user_id)
      if (result.error || !result.data) {
        console.error("Error fetching delivery:", result.error)
        return
      }
      setDelivery(result as Delivery)
    }
    fetchData()
  }, [delivery_id, product_id, user_id])

  console.log("c", delivery);
  

  if (!delivery?.data) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Delivery not found</h3>
          <p className="text-muted-foreground mb-4">
            The delivery you&apos;re looking for doesn&apos;t exist or has been removed
          </p>
          <Link href="/delivery-agent">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }


  // Update a single delivery date status
  const updateDeliveryDateStatus = async (date: string, newStatus: DeliveryStatus) => {
    if (!delivery?.data) return;
    
    const updatedStatusArray = delivery.data.deliverystatus.map((day) =>
      day.date === date ? { ...day, status: newStatus } : day
    )
  
    // Update local state
    setDelivery((prev: Delivery | null): Delivery | null => {
      if (!prev?.data) return prev;
      return {
        data: {
          ...prev.data,
          deliverystatus: updatedStatusArray,
        },
        error: null
      }
    })
  
    // Update in database
    try {
      await updateDeliveryStatusInDB(delivery.data.id, updatedStatusArray)
      toast.success("Status updated", { id: toastId })
    } catch (error) {
      console.error("Failed to update status in DB", error)
      toast.error("Failed to update status")
    }
  }
  

  // Update all future delivery dates
  const updateAllFutureDeliveryStatus = (newStatus: DeliveryStatus) => {
    const today = new Date().toISOString().split("T")[0] // Get today's date in YYYY-MM-DD format

    setDelivery({
      ...delivery,
      data: {
        ...delivery.data,
        deliverystatus: delivery.data.deliverystatus.map((day) => {
          // Only update future or today's deliveries that aren't already delivered
          const dayDate = new Date(day.date).toISOString().split("T")[0]
          if (dayDate >= today && day.status !== "delivered") {
            return { ...day, status: newStatus }
          }
          return day
        }),
      },
    })

    toast.success("All future deliveries updated",{id: toastId})
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center">
          <Link href="/dashboard/deliveries">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription {delivery?.data?.id || ''}</h1>
          <p className="text-muted-foreground">
            {/* Product ID: {delivery.product_id} | {delivery.subscription.start} - {delivery.subscription.end} */}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <User className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{delivery.data?.customer?.name || ''}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-muted-foreground">{delivery.data?.customer?.address || ''}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="mr-2 h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Contact Number</p>
                  <p className="text-muted-foreground">{delivery.data?.customer?.phone || ''}</p>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">Product</p>
                <p className="text-muted-foreground">{delivery.data?.product?.name || ''}</p>
              </div>

              <div className="flex items-center">
                <CalendarRange className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Subscription Period</p>
                  <p className="text-muted-foreground">
                    {delivery.data?.subscription?.start || ''} - {delivery.data?.subscription?.end || ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Delivery Schedule</p>
                  <p className="text-muted-foreground">
                    {delivery.data?.deliverystatus?.length} deliveries in this subscription
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Delivery Schedule</CardTitle>
            <div>
              <Select onValueChange={(value) => updateAllFutureDeliveryStatus(value as DeliveryStatus)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update all future" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Set All to Pending</SelectItem>
                  <SelectItem value="scheduled">Set All to Scheduled</SelectItem>
                  <SelectItem value="in-progress">Set All to In Progress</SelectItem>
                  <SelectItem value="delivered">Set All to Delivered</SelectItem>
                  <SelectItem value="failed">Set All to Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delivery.data?.deliverystatus?.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell>{day.date}</TableCell>
                    <TableCell>
                      <StatusBadge status={day.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        onValueChange={(value) => updateDeliveryDateStatus(day.date, value as DeliveryStatus)}
                        defaultValue={day.status}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
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

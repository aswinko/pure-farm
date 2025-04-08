"use client"

import { ArrowLeft, CalendarRange, CreditCard } from "lucide-react"
import Link from "next/link"
import { notFound, useSearchParams } from "next/navigation"

// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getOrderDetailsByOrderIdAndProductId } from "@/app/actions/order-actions"
import { useEffect, useState } from "react"
import { SubscriptionCard } from "@/components/layout/SubscriptionCard"


type Order = {
    id: string
    product: string
    user_name: string
    address: string
    city: string
    zip: string
    orderDate: string
    status: string
    price: string
    item: {
      price: number
      name: string
      quantity: number
    }
    subscription: {
      startDate: string
      endDate: string
      days: number
    }
  }

export default function OrderDetailsPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("order_id")
    const productId = searchParams.get("product_id")

    const [order, setOrder] = useState<Order | null>(null)


    useEffect(() => {
        async function fetchOrder() {
          if (!orderId || !productId) return notFound()
          const fetchedOrder = await getOrderDetailsByOrderIdAndProductId(orderId, productId)
        console.log(fetchedOrder);
        
          if (!fetchedOrder) return notFound()
          setOrder(fetchedOrder)
        }
    
        fetchOrder()
      }, [orderId, productId])
  

      if (!order) {
        return <div className="container mx-auto py-10">Loading...</div>
      }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center">
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order {order.id}</h1>
          <p className="text-muted-foreground">Placed on {order.orderDate}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Subscription Details</CardTitle>
                {/* <StatusBadge status={order.status} /> */}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{order.item.name}</h3>
                <div className="flex items-center text-sm mt-2">
                  <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                  {formatDate(order.subscription.startDate)} - {formatDate(order.subscription.endDate)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscription Price</span>
                  <span>₹{order.item.price * order.item.quantity * order.subscription.days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹{order.item.price * order.item.quantity * order.subscription.days}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.user_name}
                    <br />
                    {order.address}
                    <br />
                    {order.city}, {order.zip}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Delivery Schedule</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Daily delivery between 7:00 AM - 9:00 AM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.subscription.startDate)} - {formatDate(order.subscription.endDate)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <SubscriptionCard item={order.item}/>
      </div>
    </div>
  )
}




// function StatusBadge({ status }: { status: "active" | "completed" | "cancelled" }) {
//   const variants = {
//     active: "bg-green-100 text-green-800 hover:bg-green-100",
//     completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
//     cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
//   }

//   const labels = {
//     active: "Active",
//     completed: "Completed",
//     cancelled: "Cancelled",
//   }

//   return (
//     <Badge className={variants[status]} variant="outline">
//       {labels[status]}
//     </Badge>
//   )
// }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}


import { CalendarRange, Package } from "lucide-react"
import Link from "next/link"
import { Product } from "@/types/product"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/layout/Navbar"
import { getAllOrders } from "../actions/order-actions"
import { getCurrentUser } from "../actions/auth-actions"
import { redirect } from "next/navigation"

export default async function OrdersPage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/")
    }
    const orders = await getAllOrders(user?.user_id)
    if(!orders){
        return <div>You have no orders yet.</div>
    }

    // console.log(orders);
    
  return (
    <>
    <Navbar />
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground">View and manage your subscription orders</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.flatMap((order) =>
                order.items.map((item: Product, itemIndex: number) => (
                    <OrderCard
                        key={`${order.id}-${itemIndex}`}
                        id={order.id}
                        product={item.name}
                        productId={item.product_id || ''}
                        startDate={new Date(order.created_at).toLocaleDateString()}
                        endDate={new Date(order.created_at).toLocaleDateString()}
                        status="completed"
                        price={`₹${item.price}`}
                    />
                ))
            )}

          
        </div>
      </div>
    </div>
    </>
  )
}

interface OrderCardProps {
  id: string
  product: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "cancelled"
  price: string
  productId: string
}

function OrderCard({ id, product, startDate, endDate, status, price, productId }: OrderCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{product}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <CardDescription>{id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Subscription Price</span>
            <span className="font-medium">{price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Package className="mr-2 h-4 w-4" />
          Track
        </Button>
        <Link href={`/manage-orders/product-view?order_id=${id}&product_id=${productId}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function StatusBadge({ status }: { status: "active" | "completed" | "cancelled" }) {
  const variants = {
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    completed: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  const labels = {
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
  }

  return (
    <Badge className={variants[status]} variant="outline">
      {labels[status]}
    </Badge>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getOrderDetails } from '../actions/order-actions'

interface Subscription {
  from: string | Date
  to: string | Date
  days: number
}

interface OrderItem {
  name: string
  quantity: number
  price: number
  subscription: string | Subscription
}

interface OrderDetails {
  orderNumber: string
  date: string
  items: OrderItem[]
  total_amount: number
  tax?: number
  created_at: string
  id: number
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!paymentId) {
        setLoading(false)
        return
      }

      const order = await getOrderDetails(paymentId)
      console.log(order)

      if (!order) {
        setLoading(false)
        return
      }

      setOrderDetails(order)
      setLoading(false)
    }

    fetchOrder()
  }, [paymentId])

  if (loading) {
    return <div className="text-center py-20">Loading order...</div>
  }

  if (!orderDetails) {
    return <div className="text-center py-20 text-red-600">Order not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Your subscription order has been successfully processed. Thank you for your purchase.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Order #{orderDetails.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-medium">
              {new Date(orderDetails.created_at).toLocaleDateString()}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            {orderDetails.items?.map((item: OrderItem, index: number) => {
              const subscription: Subscription =
                typeof item.subscription === 'string'
                  ? JSON.parse(item.subscription)
                  : item.subscription

              return (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ₹{item.price.toFixed(2)} × {subscription.days} days
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(subscription.from).toLocaleDateString()} -{' '}
                        {new Date(subscription.to).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₹{(item.price * item.quantity * subscription.days).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{orderDetails.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{orderDetails.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm">
              <strong>Delivery Information:</strong> Your first delivery will arrive Ontime.
              You can manage your subscription and delivery schedule from your account dashboard.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button className="w-full sm:w-auto" onClick={() => router.push('/manage-orders')}>
            Manage Subscriptions
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push('/')}>
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>A confirmation email has been sent to your registered email address.</p>
        <p className="mt-1">If you have any questions, please contact our support team.</p>
      </div>
    </div>
  )
}

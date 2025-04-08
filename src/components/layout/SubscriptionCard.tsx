import { Package, Truck } from "lucide-react"
import { format } from "date-fns"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DeliveryStatus {
  date: string;
  status: string;
  time: string;
}

export interface SubscriptionItem {
  subscription?: string | { from: string; to: string };
  delivery_status?: DeliveryStatus[];
  price: number
}

export function SubscriptionCard({ item }: { item: SubscriptionItem }) {
  const subscription = typeof item.subscription === 'string' 
    ? JSON.parse(item.subscription) 
    : item.subscription;
  const fromDate = new Date(subscription.from)
  const toDate = new Date(subscription.to)

  // Generate all dates between from and to
  const days = []
  const currentDate = new Date(fromDate)
  while (currentDate <= toDate) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const today = format(new Date(), "yyyy-MM-dd")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
        <CardDescription>Track your subscription deliveries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {days.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd")
            const formattedDate = format(day, "MMMM d")

            const delivery = item.delivery_status?.find(
              (d: DeliveryStatus) => d.date === dateKey
            )

            const status = delivery?.status || "scheduled"
            const time = delivery?.time || "7:00 AM - 9:00 AM"

            const isDelivered = status === "delivered"
            const isToday = dateKey === today && status !== "delivered"

            const iconBg = isDelivered
              ? "bg-green-100"
              : isToday
              ? "bg-yellow-100"
              : "bg-blue-100"
            const iconColor = isDelivered ? "text-green-600" : "text-blue-600"
            const Icon = isDelivered ? Package : Truck

            const badgeBg = isDelivered
              ? "bg-green-100 text-green-800"
              : isToday
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"

            return (
              <div className="flex items-start" key={index}>
                <div
                  className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{formattedDate} Delivery</p>
                  <p className="text-sm text-muted-foreground">
                    {isDelivered
                      ? `Delivered at ${time}`
                      : isToday
                      ? `Out for delivery`
                      : `Scheduled for ${time}`}
                  </p>
                </div>
                <Badge className={badgeBg} variant="outline">
                  {isDelivered ? "Delivered" : isToday ? "Today" : "Scheduled"}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

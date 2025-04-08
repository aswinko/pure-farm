"use server"

import { createClient } from "@/lib/supabase/server"
import { SubscriptionItem } from "@/components/layout/SubscriptionCard"

interface OrderItem extends SubscriptionItem {
  product_id: string;
}

export async function getOrderDetails(paymentId: string) {
  const supabase = await createClient()

  // Get the order details
  const { data: order, error: orderError } = await supabase
  .from('orders')
  .select('*')
  .eq('razorpay_payment_id', paymentId)
  .single()

  if (orderError) {
    console.error("Error fetching order:", orderError.message)
    return null
  }
    return order
}

export async function getOrderDetailsByOrderIdAndProductId(orderId: string, productId: string) {
  const supabase = await createClient()

  // Get the order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderError) {
    console.error("Error fetching order:", orderError.message)
    return null
  }

  // Find the specific item by product_id
  const item = order.items?.find((i: OrderItem) => i.product_id === productId)

  if (!item) {
    console.error("Item not found for product_id:", productId)
    return null
  }

  let subscription = null
  let startDate = null
  let endDate = null

  if (item.subscription) {
    try {
      subscription = JSON.parse(item.subscription)
      startDate = subscription.from
      endDate = subscription.to
    } catch (err) {
      console.error("Error parsing subscription JSON:", err)
    }
  }

  // Parse delivery_status if it's stored as a JSON string
  let delivery_status = []
  if (item.delivery_status) {
    try {
      delivery_status = typeof item.delivery_status === "string"
        ? JSON.parse(item.delivery_status)
        : item.delivery_status
    } catch (err) {
      console.error("Error parsing delivery_status JSON:", err)
    }
  }

  return {
    ...order,
    item: {
      ...item,
      delivery_status
    },
    subscription: {
      ...subscription,
      startDate,
      endDate
    }
  }
}



export async function getAllOrders (userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq("user_id", userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error.message)
    return null
  }

  return data
}

export async function clearCart(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)

  if (error) {
    console.error("Failed to clear cart:", error.message)
    return false
  }

  return true
}

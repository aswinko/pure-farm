"use server"

import { createClient } from "@/lib/supabase/server"
import { SubscriptionItem } from "@/components/layout/SubscriptionCard"

interface OrderItem extends SubscriptionItem {
  product_id: string;
}


export async function getTotalOrderAmount() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('total_amount', { count: 'exact', head: false })

  if (error || !data) {
    console.error("Error fetching total amounts:", error)
    return 0
  }

  const total = data.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  return total
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


export async function getAllOrder() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error.message)
    return null
  }

  return data
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


export const getAllDeliveries = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('delivery')
    .select(`
      id,
      product_id,
      order_id,
      user_id,
      status,
      from_date,
      to_date,
      quantity,
      deliverystatus,
      status,
      orders (
        user_name,
        phone,
        address
      ),
      products (
        name,
        image,
        description
      )
    `);

  if (error) {
    console.error('Delivery fetch error:', error);
    return { error };
  }
  console.log(data);
  

  // Format the delivery data
  const formatted = data.map((item: any) => {
    const startDate = new Date(item.from_date);
    const endDate = new Date(item.to_date);
    const deliverystatus = [];

    const current = new Date(startDate);
    while (current <= endDate) {
      deliverystatus.push({
        date: current.toDateString(),
        status: item.status === 'pending' ? 'scheduled' : 'delivered',
      });
      current.setDate(current.getDate() + 1);
    }

    return {
      id: item.id,
      product_id: item.product_id,
      user_id: item.user_id,
      customer: {
        name: item.orders?.user_name || 'Unknown',
        address: item.orders?.address || 'N/A', // optional if address is available
        phone: item.orders?.phone || 'N/A',
      },
      product: item.products?.name || 'Product',
      subscription: {
        start: new Date(item.from_date).toDateString(),
        end: new Date(item.to_date).toDateString(),
      },
      status: item.status,
      deliverystatus,
    };
  });

  return { data: formatted };
};


export async function updateDeliveryStatusInDB(
  deliveryId: string,
  updatedDeliveryStatus: { date: string; status: string }[]
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("delivery")
    .update({ deliverystatus: updatedDeliveryStatus })
    .eq("id", deliveryId)

  if (error) {
    console.error("Error updating deliveryStatus:", error)
    throw error
  }

  return { success: true }
}



export async function getDeliveryByIds(delivery_id: string, product_id: string, user_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("delivery")
    .select(
      `
        id,
        product_id,
        user_id,
        order_id,
        quantity,
        from_date,
        to_date,
        status,
        deliverystatus,
        orders (
          user_name,
          address,
          phone
        ),
        products (
          name,
          image,
          price
        )
      `
    )
    .eq("id", delivery_id)
    .eq("product_id", product_id)
    .eq("user_id", user_id)
    .single()

  if (error) {
    console.error("Error fetching delivery by IDs:", error)
    return { error, data: null }
  }



  return {
    data: {
      id: data.id,
      product_id: data.product_id,
      user_id: data.user_id,
      customer: {
        name: data.orders?.user_name || "No Name",
        address: data.orders?.address || "No Address",
        phone: data.orders?.phone || "No Phone",
      },
      product: {
        name: data.products?.name || "Unnamed Product",
        image: data.products?.image || "",
        price: data.products?.price || 0,
      },
      quantity: data.quantity,
      subscription: {
        start: data.from_date,
        end: data.to_date,
      },
      deliverystatus: data.deliverystatus,
      status: data.status,
    },
    error: null, 
  }
}




export async function getOrdersByProductCreator(userId: string) {
  const supabase = await createClient()

  // 1. Get all products created by this user
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id')
    .eq('user_id', userId) // or 'user_id', depending on your schema

  if (prodError || !products) {
    console.error('Error fetching products:', prodError?.message)
    return null
  }

  const productIds = products.map((p) => p.id)

  // 2. Get all orders that contain any of those productIds
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (orderError || !orders) {
    console.error('Error fetching orders:', orderError?.message)
    return null
  }

  // 3. Filter orders where items include at least one product created by this user
  const relevantOrders = orders.filter((order) =>
    order.items?.some((item: any) => productIds.includes(item.product_id))
  )

  return relevantOrders
}


export async function getAllOrdersAdmin() {
  const supabase = await createClient()

  // 1. Get all products created by this user


  // 2. Get all orders that contain any of those productIds
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (orderError || !orders) {
    console.error('Error fetching orders:', orderError?.message)
    return null
  }

  return orders
}
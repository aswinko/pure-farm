"use server"

import { CartItem } from "@/context/cart-context"
import { createClient } from "@/lib/supabase/server"


export async function addItemToCart(userId: string, item: CartItem) {
  const supabase = await createClient()

  const { data: existingItem, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", item.id)
    .maybeSingle()

  if (error) throw new Error(error.message)

  if (existingItem) {
    // Update quantity if item exists
    await supabase
      .from("cart")
      .update({ quantity: existingItem.quantity + item.quantity })
      .eq("id", existingItem.id)
  } else {
    // Insert new item
    await supabase.from("cart").insert({
      user_id: userId,
      product_id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      subscription: item.subscription ? JSON.stringify(item.subscription) : null,
    })
  }
}

export async function updateItemQuantity(userId: string, id: string, quantity: number) {
    const supabase = await createClient()
    await supabase
    .from("cart")
    .update({ quantity: Math.max(1, quantity) })
    .eq("user_id", userId)
    .eq("id", id)
}

export async function removeItemFromCart(userId: string, id: string) {
    const supabase = await createClient()
    await supabase.from("cart").delete().eq("user_id", userId).eq("id", id)
}

export async function clearCart(userId: string) {
    const supabase = await createClient()
    await supabase.from("cart").delete().eq("user_id", userId)
}

export async function getCartItems(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", userId)

  if (error) throw new Error(error.message)

  return data || []
}

export async function getCartTotal(userId: string) {
    const cart = await getCartItems(userId)
  
    return cart.reduce((total, item) => {
      const subscription = item.subscription ? JSON.parse(item.subscription) : null
  
      return subscription
        ? total + item.price * item.quantity * subscription.days
        : total + item.price * item.quantity
    }, 0)
  }

export async function getCartCount(userId: string) {
  const cart = await getCartItems(userId)
  return cart.reduce((count, item) => count + item.quantity, 0)
}

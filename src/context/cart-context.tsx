"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getCartItems, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart, getCartTotal, getCartCount } from "@/app/actions/cart-actions"
import { createClient } from "@/lib/supabase/client"
import { User } from "@/types/user"

export type SubscriptionDetails = {
  from: Date
  to: Date
  days: number
}

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  subscription?: SubscriptionDetails
  product_id?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  updateItemQuantity: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => Promise<number>
  getCartCount: () => Promise<number>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const [user, setUser] = useState<User | null>(null) // Store user

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        setUser(data.user)
        const cartItems = await getCartItems(data.user.id)
        setItems(cartItems)
      }
    }
    fetchUser()
  }, [])

  const addItem = async (item: CartItem) => {
    if (!user) return
    await addItemToCart(user.id, item)
    setItems(await getCartItems(user.id))
  }

  const updateItemQuantityHandler = async (id: string, quantity: number) => {
    if (!user) return
    await updateItemQuantity(user.id, id, quantity)
    setItems(await getCartItems(user.id))
  }

  const removeItem = async (id: string) => {
    if (!user) return
    await removeItemFromCart(user.id, id)
    setItems(await getCartItems(user.id))
  }

  const clearCartHandler = async () => {
    if (!user) return
    await clearCart(user.id)
    setItems([])
  }

  const getCartTotalHandler = async () => (user ? await getCartTotal(user.id) : 0)

  const getCartCountHandler = async () => (user ? await getCartCount(user.id) : 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItemQuantity: updateItemQuantityHandler,
        removeItem,
        clearCart: clearCartHandler,
        getCartTotal: getCartTotalHandler,
        getCartCount: getCartCountHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

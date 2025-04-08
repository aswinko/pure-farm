"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function CartIcon({ className }: { className?: string }) {
    const { getCartCount } = useCart()
    const router = useRouter()
    const [itemCount, setItemCount] = useState<number>(0)
  
    useEffect(() => {
      async function fetchCartCount() {
        const count = await getCartCount()
        setItemCount(count)
      }
  
      fetchCartCount()
    }, [getCartCount])
  

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={() => router.push("/cart")}
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-10 w-10"  />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {itemCount}
        </span>
      )}
    </Button>
  )
}


"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function CartPageClient() {
  const router = useRouter()
  const { items, updateItemQuantity, removeItem, getCartTotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  // const [cartTotal, setCartTotal] = useState(0)
  const [loading, setLoading] = useState(true); // Added loading state


   // Calculate cart total with useMemo to optimize performance
   const cartTotal = useMemo(() => {
    if (!items || items.length === 0) return 0;
  
    return items.reduce((total, item) => {
      const subscription = typeof item.subscription === "string"
        ? JSON.parse(item.subscription)
        : item.subscription;
  
      const itemTotal = subscription
        ? item.price * item.quantity * subscription.days
        : item.price * item.quantity;
  
      return total + (isNaN(itemTotal) ? 0 : itemTotal);
    }, 0);
  }, [items]);
  
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      await getCartTotal(); // Ensure data is fresh
      setLoading(false);
    }
    fetchData();
  }, [getCartTotal]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    router.push("/checkout")
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-16 text-lg font-medium">Loading cart items...</div>
        ) : 
          items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted rounded-full p-6 mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. Browse our products and find something you&apos;ll
              love.
            </p>
            <Button onClick={() => router.push("/")} size="lg">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-background rounded-lg border shadow-sm">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 text-sm text-muted-foreground font-medium">
                  <div>Product</div>
                  <div>Price</div>
                  <div>Quantity</div>
                  <div></div>
                </div>
                <Separator />
                <div>
                  {items.map((item, index) => (
                    <div key={index}>
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 items-center">
                        <div className="flex gap-4 items-center">
                          <div className="relative h-20 w-20 overflow-hidden rounded-md border bg-muted">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {item.subscription && item.subscription.from && item.subscription.to && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(item.subscription.from), "MMM d")} -{" "}
                                  {format(new Date(item.subscription.to), "MMM d, yyyy")}
                                </span>
                              </div>
                            )}
                            <p className="text-sm font-medium md:hidden mt-1">
                              $
                              {item.subscription
                                ? (item.price * item.quantity * item.subscription.days).toFixed(2)
                                : (item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="hidden md:block">
                          {(() => {
                            const subscription = item.subscription ? JSON.parse(item.subscription) : null;
                            return (
                              <>
                                <p className="font-medium">
                                  ₹
                                  {subscription
                                    ? (item.price * item.quantity * subscription.days).toFixed(2)
                                    : (item.price * item.quantity).toFixed(2)}
                                </p>
                                {subscription && (
                                  <p className="text-xs text-muted-foreground">
                                    ₹{item.price.toFixed(2)} × {item.quantity} × {subscription.days} days
                                  </p>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-l-md"
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none rounded-r-md"
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-background rounded-lg border shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full mt-6" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Full payment will be collected for the entire subscription period
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

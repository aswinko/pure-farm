"use client"

import type React from "react"

import { useEffect, useId, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import MapPin from "@/components/layout/MapPin"

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayWindow extends Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

declare const window: RazorpayWindow;

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const toastId = useId()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    location: { lat: 0, lng: 0 },
    paymentMethod: "card",
  })

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setFormData((prev) => ({ ...prev, location }));
  };
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
    

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    
  
    try {
      const total_amount = cartTotal;
      const {
        name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        location, // { lat, lng }
      } = formData;
  
      // ✅ 1. Create Razorpay Order
      const createOrderRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total_amount }),
      });
  
      const { id: order_id } = await createOrderRes.json();
  
      // ✅ 2. Setup Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: total_amount * 100,
        currency: "INR",
        name: "Pure Farm",
        description: "Order Payment",
        order_id,
        handler: async function (response: RazorpayResponse) {
          // ✅ 3. Verify payment and store order
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_name: name,
              user_email: email,
              phone,
              address,
              city,
              state,
              zip,
              total_amount,
              items,
              location, // ✅ location: { lat, lng }
            }),
          });
  
          const result = await verifyRes.json();
          
  
          if (result.success) {
            toast.success("✅ Payment successful! Order placed.", { id: toastId });
            clearCart();
            router.push(`/order-confirmation?payment_id=${response.razorpay_payment_id}`);
          } else {
            toast.error("❌ Payment verification failed.", { id: toastId });
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      // ✅ 4. Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("❌ Payment failed. Please try again.", { id: toastId });
    }
  };
  
  if (items.length === 0) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-4">You need to add items to your cart before checking out.</p>
          <Button onClick={() => router.push("/")}>Browse Products</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" className="mb-6 pl-0" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>Enter your delivery details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-6 sm:col-span-3">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                    </div>
                    <div className="col-span-3 sm:col-span-1">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div>
                    <MapPin onLocationSelect={handleLocationSelect} />
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardFooter>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Processing..." : `Pay ₹${cartTotal.toFixed(2)}`}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {items.length} {items.length === 1 ? "item" : "items"} in your cart
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                        {item.subscription && (
                          <>
                            {" "}
                            | {typeof item.subscription === "string"
                              ? JSON.parse(item.subscription).days
                              : item.subscription.days}{" "}
                            days
                          </>
                        )}
                      </p>
                    </div>
                    <div className="text-right font-medium">
                      ₹
                      {item.subscription
                        ? (
                            item.price *
                            item.quantity *
                            (typeof item.subscription === "string"
                              ? JSON.parse(item.subscription).days
                              : item.subscription.days)
                          ).toFixed(2)
                        : (item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tax</span>
                    <span>₹{0}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Full payment will be collected for the entire subscription period</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}


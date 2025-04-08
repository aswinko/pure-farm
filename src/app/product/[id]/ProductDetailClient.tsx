"use client"

import { useId, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ShoppingCart, Minus, Plus, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/types/product"
import { ProductCard } from "@/components/layout/ProductCard"
import { toast } from "sonner"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useCart } from "@/context/cart-context"
import { DateRange } from "react-day-picker"


export default function ProductDetailClient({product, relatedProducts}: {product: Product, relatedProducts: {relatedProducts: Product[]}}) {
  const toastId = useId()

  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })

  const { addItem } = useCart()


  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }


    // Calculate number of days in the subscription
    const getDaysCount = () => {
      if (!dateRange.from || !dateRange.to) return 0
  
      const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end dates
      return diffDays
    }
  
    const daysCount = getDaysCount()
    const totalPrice = product.price * quantity * daysCount
  


    const addToCart = async () => {
      if (!dateRange.from || !dateRange.to) {
        toast.error("You need to select a date range for your subscription.", { id: toastId });
        return;
      }
    
      setLoading(true); // Start loading
    
      try {
        await addItem({
          id: product.id || "", // Ensure id is a string
          name: product.name || "",
          price: product.price || 0,
          image: product.image || "",
          quantity: quantity,
          subscription: {
            from: dateRange?.from || new Date(),
            to: dateRange?.to || new Date(),
            days: daysCount,
          },
        });
    
        toast.success(`${quantity} × ${product.name} subscription added to your cart.`, { id: toastId });
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart. Please try again.", { id: toastId });
      } finally {
        setLoading(false); // Stop loading
      }
    };
    

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="#" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={product?.image || ""}
              alt={product?.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
        <div>
              <Badge className="mb-2">Subscription Available</Badge>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-2">{product.description}</p>
            </div>

            <div className="text-2xl font-bold">
            ₹{product.price.toFixed(2)} per {product?.unit}
            </div>

            <div>
              <h3 className="font-medium mb-2">Quantity (per day)</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">
                  {quantity} {quantity === 1 ? product?.unit : `${product?.unit}s`}
                </span>
                <Button variant="outline" size="icon" onClick={increaseQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Delivery Period</h3>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange?.to ? (
                          <>
                            {format(dateRange?.from, "PPP")} - {format(dateRange?.to, "PPP")}
                          </>
                        ) : (
                          format(dateRange?.from, "PPP")
                        )
                      ) : (
                        "Select delivery dates"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={new Date()}
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range) {
                          setDateRange(range)
                        } else {
                          setDateRange({ from: undefined, to: undefined })
                        }
                      }}
                      numberOfMonths={2}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {dateRange?.from && dateRange?.to && (
                  <p className="text-sm text-muted-foreground">{daysCount} days of delivery</p>
                )}
              </div>
            </div>

            {dateRange.from && dateRange.to && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Daily price</span>
                  <span className="font-medium">₹{(product.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery period</span>
                  <span>{daysCount} days</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total subscription price</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="flex-1" size="lg" onClick={addToCart} disabled={!dateRange.from || !dateRange.to && loading}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add Subscription to Cart
              </Button>
            </div>

          <Separator />

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4">
              <p className="text-muted-foreground">{product.description}</p>
            </TabsContent>
            <TabsContent value="features" className="pt-4">
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {product?.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </TabsContent>

          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts?.relatedProducts?.map((item: Product, index: number) => (
                <Link
                href={`/product/${item.id}`}
                className="hover:scale-[102%] transition-transform duration-300"
                key={index}
              >
                  <ProductCard
                    title={item.name}
                    description={item.description || ""}
                    imageUrl={item.image || ""}
                    price={item.price}
                  />
              </Link>
              ))}
            </div>
          </div>
    </div>
  )
}


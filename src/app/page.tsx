import Link from "next/link"
import { ArrowRight, Check, Leaf, ShoppingBasket, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/layout/ImageCarousel"
import Navbar from "@/components/layout/Navbar"
import { getAllCategories, getAllProducts } from "./actions/product-actions"
import AllProductCategory from "@/components/customer/allproduct-category"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Footer from "@/components/layout/Footer"
// import AllProductCategory from "@/components/user/all-product-category"

export default async function Home() {
  const products = await getAllProducts();

  const supabase = await createClient()

  const { data } = await supabase.auth.getUser()
  
   // Fetch categories and create a mapping { category_id: category_name }
   const categories = await getAllCategories();
   const categoryMap = categories.reduce((acc, category) => {
     acc[category.id] = category.name; // { 1: "Fruits", 2: "Vegetables" }
     return acc;
   }, {} as { [key: number]: string });
 
   // Add category names to products
   const productsWithCategoryNames = products.map((product) => ({
     ...product,
     category_name: categoryMap[product.category_id] || "Other",
   }));



  return (
  <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section - Image Only */}
        <section className="w-full h-screen relative">
          <ImageCarousel />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <Link href="#intro">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
              >
                <ArrowRight className="h-4 w-4 rotate-90" />
              </Button>
            </Link>
          </div>
        </section>
          {/* Category based sliders */}  
           {/* Dynamically Render Product Categories */}
          <AllProductCategory products={productsWithCategoryNames} />
          
           {/* Introduction Section */}
        <section id="intro" className="w-full py-20 md:py-28 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <Leaf className="h-12 w-12 text-green-600" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                Fresh Farm Products Delivered to Your Doorstep
              </h1>
              <p className="text-xl text-gray-500 md:text-2xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed max-w-[700px]">
                Connect directly with local farmers, customize your orders, and enjoy fresh produce with convenient
                delivery options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-28 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
                Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Everything You Need in One Place</h2>
              <p className="text-xl text-gray-500 max-w-[800px]">
                PureFarm Market provides a complete ecosystem for farmers, suppliers, and customers to connect and
                transact seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">For Farmers</h3>
                <p className="text-gray-500">
                  List your products, manage inventory, and connect directly with customers. Receive orders and prepare
                  them for delivery.
                </p>
                <ul className="mt-6 space-y-2 text-left">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Simple product management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Direct customer communication</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Streamlined order processing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">For Suppliers</h3>
                <p className="text-gray-500">
                  Manage delivery logistics, pick up orders from farmers, and ensure timely delivery to customers with
                  real-time tracking.
                </p>
                <ul className="mt-6 space-y-2 text-left">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Optimized delivery routes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Real-time order tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Efficient pickup scheduling</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <ShoppingBasket className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">For Customers</h3>
                <p className="text-gray-500">
                  Browse fresh products, place customized orders with subscription options, and track your deliveries in
                  real-time.
                </p>
                <ul className="mt-6 space-y-2 text-left">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Fresh, local produce</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Flexible subscription options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <span>Convenient home delivery</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 md:py-28 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
                Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">How It Works</h2>
              <p className="text-xl text-gray-500 max-w-[800px]">
                Our streamlined process ensures a smooth experience for all users from registration to delivery.
              </p>
            </div>

            <div className="relative">
              {/* Process steps with connecting line */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-green-100 z-0"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center mb-6 text-xl font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-3">Browse & Select</h3>
                  <p className="text-gray-500">
                    Browse through our marketplace of fresh, locally-sourced products from farmers in your area.
                  </p>
                  <Image
                    src="/browse.png"
                    width={300}
                    height={200}
                    alt="Browse products"
                    className="mt-6 rounded-lg shadow-md"
                  />
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center mb-6 text-xl font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-3">Order & Customize</h3>
                  <p className="text-gray-500">
                    Place your order with customization options, including subscriptions and day-wise adjustments.
                  </p>
                  <Image
                    src="/orders.png"
                    width={300}
                    height={200}
                    alt="Customize order"
                    className="mt-6 rounded-lg shadow-md"
                  />
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-green-600 text-white flex items-center justify-center mb-6 text-xl font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-3">Receive & Enjoy</h3>
                  <p className="text-gray-500">
                    Your order is delivered fresh to your doorstep at your preferred time and date.
                  </p>
                  <Image
                    src="/confirm.png"
                    width={300}
                    height={200}
                    alt="Delivery"
                    className="mt-6 rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
          <section id="testimonials" className="container mx-auto w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">
                    Testimonials
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Hear from our community of farmers, suppliers, and customers about their experience with PureFarm
                    Market.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                  <div className="space-y-2">
                    <p className="text-gray-500 italic">
                      PureFarm Market has transformed my business. I can now reach more customers directly and manage my
                      inventory efficiently.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-gray-500">Organic Vegetable Farmer</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                  <div className="space-y-2">
                    <p className="text-gray-500 italic">
                      As a delivery manager, the platform makes it easy to coordinate pickups and deliveries. The
                      real-time tracking is a game-changer.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                      <div>
                        <p className="font-medium">Jane Smith</p>
                        <p className="text-sm text-gray-500">Delivery Supplier</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4 border rounded-lg p-6 shadow-sm">
                  <div className="space-y-2">
                    <p className="text-gray-500 italic">
                      I love getting fresh produce delivered to my doorstep. The subscription feature for daily milk
                      delivery is so convenient!
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                      <div>
                        <p className="font-medium">Sarah Johnson</p>
                        <p className="text-sm text-gray-500">Regular Customer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {
            !data ? (
              <section className=" w-full py-12 md:py-24 lg:py-32 bg-green-600 text-white">
                <div className="container mx-auto px-4 md:px-6">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join PureFarm Market Today</h2>
                      <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Whether you re a farmer, supplier, or customer, PureFarm Market has everything you need for a seamless
                        farm-to-table experience.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Link href="/register">
                        <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                          Sign Up Now
                        </Button>
                      </Link>
                      <Link href="/login">
                        <Button size="lg" variant="outline" className="border-white bg-inset text-white hover:text-white hover:bg-green-600">
                          Log In
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              ""
            )
          }
          
        </main>
        <Footer />
      </div>

  </>
  )
}


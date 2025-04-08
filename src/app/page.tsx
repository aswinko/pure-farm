import Link from "next/link"
import { Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ImageCarousel } from "@/components/layout/ImageCarousel"
import Navbar from "@/components/layout/Navbar"
import { getAllCategories, getAllProducts } from "./actions/product-actions"
import AllProductCategory from "@/components/customer/allproduct-category"
import { createClient } from "@/lib/supabase/server"
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
          <section className="w-full bg-green-50">
            <div className="">  
              <ImageCarousel /> 
            </div>
          </section>
          {/* Category based sliders */}
           {/* Dynamically Render Product Categories */}
          <AllProductCategory products={productsWithCategoryNames} />
          
          <section id="how-it-works" className="container mx-auto w-full py-12 md:py-24 lg:py-32 bg-gray-50">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-600">Process</div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                  <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our streamlined process ensures a smooth experience for all users from registration to delivery.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl gap-8 py-12">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                      1
                    </div>
                    <h3 className="text-xl font-bold">Registration</h3>
                    <p className="text-gray-500">
                      Sign up as a farmer, supplier, or customer. Each role has specific features tailored to their needs.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                      2
                    </div>
                    <h3 className="text-xl font-bold">Product Listing & Browsing</h3>
                    <p className="text-gray-500">
                      Farmers list their products while customers browse and select items for purchase.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                      3
                    </div>
                    <h3 className="text-xl font-bold">Order Placement</h3>
                    <p className="text-gray-500">
                      Customers place orders with customization options, including subscriptions and day-wise adjustments.
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                      4
                    </div>
                    <h3 className="text-xl font-bold">Order Processing</h3>
                    <p className="text-gray-500">
                      Orders are assigned to farmers who prepare the products and mark them ready for pickup.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                      5
                    </div>
                    <h3 className="text-xl font-bold">Delivery Management</h3>
                    <p className="text-gray-500">
                      Suppliers pick up orders from farmers and manage the delivery logistics to customers.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-xl">
                      6
                    </div>
                    <h3 className="text-xl font-bold">Feedback & Ratings</h3>
                    <p className="text-gray-500">
                      Customers provide feedback on product quality and delivery service to improve the experience.
                    </p>
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
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <p className="text-sm text-gray-500">© 2023 PureFarm Market. All rights reserved.</p>
          </div>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
            <Link className="text-sm hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </nav>
        </footer>
      </div>

  </>
  )
}


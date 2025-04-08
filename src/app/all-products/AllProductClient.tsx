// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { Product } from "@/types/product";
// import { ProductCard } from "@/components/layout/ProductCard";

// interface AllProductClientProps {
//   product: Product[];
//   category: { id: string; name: string }[];
// }

// const AllProductClient = ({ product, category }: AllProductClientProps) => {
//   // 🌟 State for events and filters
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
//   const [ , setCategoryLoading] = useState(true);

//   const [priceFilter, setPriceFilter] = useState("");

//   // 🌟 Fetch events when the component mounts
//   useEffect(() => {
//     async function fetchProducts() {
//         // const prods = await getAllProductsExceptCurrentUser(id)
//         setProducts(product);
//     }
//     fetchProducts();
//   }, [product]);

//   useEffect(() => {
//     async function fetchCategories() {
//       setCategoryLoading(true);
//       try {
//         // const data = await getAllCategories();
//         setCategories(category);
//       } catch (error) {
//         console.log(error);
        
//         toast.error("Failed to fetch categories.");
//       } finally {
//         setCategoryLoading(false);
//       }
//     }
//     fetchCategories();
//   }, [category]);

//   // 🌟 Filtered Events
//   const filteredProducts = products.filter((product: Product) => {
//     return (
//       (!searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
//       (!selectedCategory || product.category_id === selectedCategory) &&
//       (!priceFilter ||
//         (priceFilter === "low" && product.price < 500) ||
//         (priceFilter === "mid" && product.price >= 5000 && product.price < 20000) ||
//         (priceFilter === "high" && product.price >= 20000))
//     );
//   });

//   return (
//       <div className="flex flex-col min-h-screen">
//         <main className="flex-1">
//           {/* 🌟 Search & Filter Section */}
//           <section className="container mx-auto mt-6 flex flex-wrap gap-4 items-center">
//             {/* Search Bar */}
//             <Input
//               type="text"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full sm:w-1/3"
//             />

//             {/* Category Filter */}
//              <Select onValueChange={setSelectedCategory}>
//                     <SelectTrigger>
//                     <SelectValue placeholder="Select a category" />
//                     </SelectTrigger>
//                     <SelectContent>
//                     {categories.map((category) => (
//                         <SelectItem key={category.id} value={category.id}>
//                         {category.name}
//                         </SelectItem>
//                     ))}
//                     </SelectContent>
//                 </Select>

//             {/* Price Filter */}
//             <Select onValueChange={setPriceFilter}>
//               <SelectTrigger className="w-full sm:w-1/4">
//                 <SelectValue placeholder="Select Price Range" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="d">All</SelectItem>
//                 <SelectItem value="low">Below ₹500</SelectItem>
//                 <SelectItem value="mid">₹500 - ₹2000</SelectItem>
//                 <SelectItem value="high">Above ₹2000</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Reset Button */}
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setSearchQuery("");
//                 setSelectedCategory("");
//                 setPriceFilter("");
//               }}
//             >
//               Reset
//             </Button>
//           </section>

//           {/* 🌟 Events List */}
//           <section className="container mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((product: Product, index) => (
//                 <Link
//                   href={`/product/${product.id}`}
//                   className="hover:scale-[102%] transition-transform duration-300"
//                   key={index}
//                 >
//                   <ProductCard
//                     title={product.name}
//                     description={product.description || ""}
//                     imageUrl={product.image || ""}
//                     price={product.price}
//                   />
//                 </Link>
//               ))
//             ) : (
//               <div className="col-span-full text-center text-gray-500 mt-10">
//                 No products found.
//               </div>
//             )}
//           </section>
//         </main>
//       </div>
//   );
// };

// export default AllProductClient;

"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Header } from "@/components/header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Product } from "@/types/product"

interface AllProductClientProps {
  products: Product[];
  categories: { id: string; name: string; }[];
}

export default function AllProductClient({ products, categories }: AllProductClientProps) {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  

  // Filter products based on search query and category
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === "all" || product.category_id === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Fresh Products</h1>
            <p className="text-muted-foreground">Subscribe to your favorite products for regular delivery</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="gap-4">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              All
            </TabsTrigger>
            {categories.map((category: { name: string; id: string }, index: number) => (
                <TabsTrigger key={index} value={category.name} onClick={() => setActiveCategory(category.id)}>
                  {category.name}
                </TabsTrigger>
            ))}   
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                  <Badge className="absolute top-2 right-2">
                  {categories.find((cat) => cat.id === product.category_id)?.name || "Unknown"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <p className="font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">per {product.quantity}</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Subscription Benefits */}
        <div className="mt-16 bg-muted p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Subscribe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Convenient Delivery</h3>
              <p className="text-muted-foreground">Get fresh products delivered to your doorstep on your schedule.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Save Money</h3>
              <p className="text-muted-foreground">
                Subscribers get special discounts and priority access to seasonal products.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                We guarantee the freshness and quality of all our subscription products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


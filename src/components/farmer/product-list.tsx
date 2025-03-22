"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category_id: string;
  quantity: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductList({ refresh }: { refresh: boolean }) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [refresh]);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) console.error("Error fetching products:", error.message);
    else setProducts(data || []);
  }


  async function fetchCategories() {
    const { data, error } = await supabase.from("categories").select("id, name");
    if (error) console.error("Error fetching categories:", error.message);
    else {      
      const categoryMap: { [key: string]: string } = {};
      data.forEach((category: Category) => {
        categoryMap[category.id] = category.name;
      });
      setCategories(categoryMap);
    }
  }  

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-12">
      {products.length > 0 ? (
        products.map((product) => (
          <Card key={product.id} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {product.image && (
                <Image src={product.image} alt={product.name} width={300} height={200} className="rounded-lg mb-2" />
              )}
              <p className="text-gray-700 font-semibold">
                Category: {categories[product.category_id] || "Unknown"}
              </p>              
              <p className="text-gray-700">{product.quantity || "0"}</p>
              <p className="text-gray-700">{product.description || "No description"}</p>
              <p className="font-bold mt-2">₹{product.price}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}

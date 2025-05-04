"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getCurrentUser } from "@/app/actions/auth-actions";
import { Button } from "../ui/button";
import { Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import AddProductForm from "./product-form";
import { Product } from "@/types/product";

interface Category {
  id: string;
  name: string;
}

export default function ProductList({ refresh, role }: { refresh: boolean; role: string }) {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [refresh]);

  async function fetchProducts() {
    const user = await getCurrentUser();
    if (role === "farmer") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", user?.user_id)
        .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error.message);
        } else {
          setProducts(data || []);
        }
    }else {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error.message);
        } else {
          setProducts(data || []);
        }
    }

    console.log("Products:", products);
    
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name");
    if (error) {
      console.error("Error fetching categories:", error.message);
    } else {
      const categoryMap: { [key: string]: string } = {};
      data.forEach((category: Category) => {
        categoryMap[category.id] = category.name;
      });
      setCategories(categoryMap);
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mx-12">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id} className="shadow-md">
              <CardHeader className="flex justify-between items-start">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                {
                  role === "farmer" && (
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    >
                    <Edit2 className="text-black w-5 h-5" />
                    </Button>
                  )
                }
                
              </CardHeader>
              <CardContent>
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="rounded-lg mb-2"
                  />
                )}
                <p className="text-gray-700 font-semibold">
                  Category: {categories[product.category_id] || "Unknown"}
                </p>
                <p className="text-gray-700">Qty: {product.quantity || 0}</p>
                <p className="text-gray-700">
                  {product.description || "No description"}
                </p>
                <p className="font-bold mt-2">₹{product.price}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[99vh] overflow-y-auto">
          <DialogTitle>Edit Product</DialogTitle>
          <AddProductForm
            mode="edit"
            defaultValues={selectedProduct || undefined}
            onSubmitComplete={() => {
              setOpen(false);
              fetchProducts();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import AddProductForm from "@/components/farmer/product-form";
import ProductList from "@/components/farmer/product-list";

export default function ProductsPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Manage Products</h1>

      <div className="grid md:grid-cols-1 gap-8">
        <AddProductForm onProductAdded={() => setRefresh(!refresh)} />
        <ProductList refresh={refresh} />
      </div>
    </div>
  );
}

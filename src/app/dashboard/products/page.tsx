"use client";

import { useEffect, useState } from "react";
import AddProductForm from "@/components/farmer/product-form";
import ProductList from "@/components/farmer/product-list";
import { getUserRole } from "@/app/actions/auth-actions";

export default function ProductsPage() {
  const [refresh, setRefresh] = useState(false);
  const [role, checkRole] = useState("farmer")

  useEffect(() => {
    async function fetchData(){ 
      const role = await getUserRole()
      checkRole(role || "user")
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">View Products</h1>

      <div className="grid md:grid-cols-1 gap-8">
        {role === "farmer" && (
          <AddProductForm onProductAdded={() => setRefresh(!refresh)} />
        )}
        <ProductList refresh={refresh} />
      </div>
    </div>
  );
}

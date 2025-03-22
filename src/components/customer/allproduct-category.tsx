"use client";

import { Product } from "@/types/product";
import { ProductSlider } from "@/components/layout/ProductSlider";

export default function AllProductCategory({ products }: { products: Product[] }) {
  // Group products by category name
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category_name || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as { [key: string]: Product[] });

  return (
    <>
      {/* Dynamically Render Product Categories */}
      {Object.entries(productsByCategory).map(([category, products]) => (
            <section key={category} className="w-full py-12">
              <h2 className="text-4xl font-semibold pl-12">{category}</h2>
              <div className="mx-12 pt-4">
                <ProductSlider products={products} />
              </div>
            </section>
      ))}
    </>
  );
}

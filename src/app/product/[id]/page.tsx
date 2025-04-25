import { getCategoryById, getProductById, getRelatedProducts } from "@/app/actions/product-actions"
import ProductDetailClient from "./ProductDetailClient";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

interface Params {
  params: { id: string };
}

export default async function EventDetailPage({ params }: Params) {

  const id = (await params).id;

  const supabase =  await createClient()
  const {data: {user}} = await supabase.auth.getUser()


  if (!id) return <div>Not found</div>;

  const product = await getProductById(id);
  const relatedProducts = await getRelatedProducts(id)
  
  //   console.log(product);
  let category = null
  if (product) {
  // 🔹 Fetch category name separately
  category = await getCategoryById(product.category_id);
  } else {
  // Handle the case where product is null
  category = null; // or handle accordingly
  }

  if (!product) {
    return <div>Product not found</div>;
  }
  if (!category){
    return <div>Category not found</div>;
  }  

  return (
    <>
    <Navbar />
    <ProductDetailClient user={user} product={product || null} relatedProducts={relatedProducts} />;
    </>
  )
}

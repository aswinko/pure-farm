
import Navbar from '@/components/layout/Navbar'
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getAllCategories, getAllProductsExceptCurrentUser } from '../actions/product-actions'
import AllProductClient from './AllProductClient'

export default async function AllProduct() {
    const supabase = await createClient()

    const { data } = await supabase.auth.getUser();
    if (!data || !data.user) return <div>User Not Found</div>;

    const categories = await getAllCategories();
    const products = await getAllProductsExceptCurrentUser(data.user.id);

    if (!products) return <div>Product Not Found</div>;
    if (!categories) return <div>Category Not Found</div>;

  return (
    <>
      <Navbar />
      <AllProductClient products={products} categories={categories || null} />
    </>
  )
}


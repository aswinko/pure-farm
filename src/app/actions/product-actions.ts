"use server";

import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types/product";
import { randomUUID } from "crypto";

interface UploadResponse {
  success: boolean;
  error: string | null;
  imageUrl?: string;
}

interface ProductResponse {
  success: boolean;
  error: string | null;
}

interface AddCategoryResponse {
  success: boolean;
  error: string | null;
  id?: string;
} 

/**
 * Uploads a product image to Supabase Storage
 */
export async function uploadProductImage(file: File): Promise<UploadResponse> {
  if (!file) return { success: false, error: "No file provided" };

  const supabase = await createClient();
  const fileName = `${randomUUID()}-${file.name}`; // Unique file name

  // ✅ Upload file to Supabase Storage
  const {  error } = await supabase.storage
    .from("product-image") // ✅ Ensure this matches your actual bucket name
    .upload(`images/${fileName}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) return { success: false, error: error.message };

  // ✅ Correctly Get Public URL
  const { data: urlData } = supabase.storage
    .from("product-image")
    .getPublicUrl(`images/${fileName}`);

  const imageUrl = urlData.publicUrl;

  console.log("Image URL:", imageUrl);

  return { success: true, error: null, imageUrl };
}


/**
 * Stores product details in the database
 */
export async function addProduct({
  user_id,
  name,
  price,
  description,
  image,
  category_id, // Should be a UUID
  quantity,
  features,

}: Product ): Promise<ProductResponse> {
  const supabase = await createClient();

  // Insert into the products table
  const { error } = await supabase.from("products").insert([
    {
      user_id: user_id,
      name,
      price,
      description,
      image: image || null, // Store image URL
      category_id: category_id || null, // Ensure category_id is set properly
      quantity,
      features,
    },
  ]);

  if (error) {
    return { success: false, error: "Failed to add product" };
  }

  return { success: true, error: null };
}

export async function getAllProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products") // ✅ Ensure the correct table name
    .select("id, user_id, name, price, description, quantity, category_id, image, features, unit, created_at") // ✅ Fetch only required fields
    .order("created_at", { ascending: false }); // ✅ Sort by latest products first

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return data;
}



// ✅ Add Category Function
export async function addCategory(categoryName: string): Promise<AddCategoryResponse> {
  if (!categoryName.trim()) {
    return { success: false, error: "Category name is required" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name: categoryName }]) // 🛠️ Fixed name reference
    .select("id")
    .single();

  if (error) {
    console.error("Error adding category:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, error: null, id: data.id };
}

// ✅ Get All Categories
export async function getAllCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("categories").select("id, name");

  if (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }

  return data;
}


export async function getCategoryById(categoryId: string) {
  
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .single(); // Fetch category name for given category_id

  if (error) return { name: "Other" }; // Default category if not found

  return data;
}

export async function getProductById(productId: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, name, price, image, description, quantity, unit, category_id, features")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product:", error.message);
    return null;
  }

  return data as Product;
}

export async function getRelatedProducts(id: string) {
  const supabase = await createClient();

  // Fetch the event
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) return null;

  // Fetch related events (same category, exclude current event)
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, name, price, image")
    .eq("category_id", product.category_id)
    .neq("id", id) // Exclude current event
    .limit(4); // Get only 4 related events

  return { ...product, relatedProducts: relatedProducts || [] };
}

export async function getAllProductsExceptCurrentUser(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id, user_id, name, price, description, category_id, image, features, unit, created_at")
    .neq("user_id", userId) // ✅ Exclude current user's events
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prducts:", error.message);
    return [];
  }

  return data;
}

export async function updateProductDetails(updatedProduct: Partial<Product> & { id: string }) {
  const supabase = await createClient()  

  const { error } = await supabase
    .from("products")
    .update({
      name: updatedProduct.name,
      price: updatedProduct.price,
      quantity: updatedProduct.quantity,
      description: updatedProduct.description,
      category_id: updatedProduct.category_id,
      features: updatedProduct.features,
      image: updatedProduct.image,
    })
    .eq("id", updatedProduct.id)

  if (error) {
    console.error("Update error:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addCategory, getAllCategories } from "@/app/actions/product-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // 🔹 Added state for form submission

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  // ✅ Fetch categories on page load
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // ✅ Handle category submission
  async function onSubmit(data: z.infer<typeof categorySchema>) {
    setLoadingSubmit(true); // Start loading on submission

    const response = await addCategory(data.name);
    if (response.success) {
      toast.success("Category added successfully!");
      setCategories((prev) => [...prev, { id: response.id!, name: data.name }]); // id is always returned
      reset();
    } else {
      toast.error(response.error || "Failed to add category.");
    }

    setLoadingSubmit(false); // Stop loading after submission
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Manage Categories</h1>

      {/* ✅ Add Category Form */}
      <div className="max-w-sm mx-auto border p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add a Category</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input type="text" placeholder="Category Name" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Button type="submit" className="w-full" disabled={loadingSubmit}>
            {loadingSubmit ? "Adding..." : "Add Category"} {/* 🔹 Show dynamic text */}
          </Button>
        </form>
      </div>

      {/* ✅ Display Categories */}
      <div className="mt-8 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : (
          <ul className="border rounded-lg p-4 space-y-2">
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id} className="p-2 border rounded-md shadow-sm bg-gray-100">
                  {category.name}
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No categories available.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

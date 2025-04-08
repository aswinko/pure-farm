"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadProductImage, addProduct, getAllCategories } from "@/app/actions/product-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// ✅ Define validation schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
  description: z.string().min(15, "Description must be at least 15  characters"),
  categoryId: z.string().min(1, "Please select a category"), // 🔹 Category validation
  features: z.array(z.string().min(2, "Each feature must have at least 2 characters.")).min(1, "At least one feature is required."),
  quantity: z
  .string()
  .regex(/^\d+$/, "Quantity must be a valid number")
  .transform((val) => parseInt(val, 10)), // Convert string to number
  image: z
    .any()
    .refine((files) => files?.length === 1, "Please upload an image")
});

interface AddProductFormProps {
  onProductAdded: () => void;
}

export default function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [ , setCategoryLoading] = useState(true);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { features: [] }, // ✅ Ensure features field is initialized
  });


  // ✅ Fetch categories on mount from getAllCategories()
  useEffect(() => {
    async function fetchCategories() {
      setCategoryLoading(true);
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
        
        toast.error("Failed to fetch categories.");
      } finally {
        setCategoryLoading(false);
      }
    }
    fetchCategories();
  }, []);


  const handleAddFeature = () => {
    if (featureInput.trim().length > 1) {
      const updatedFeatures = [...features, featureInput.trim()];
      setFeatures(updatedFeatures);
      setValue("features", updatedFeatures); // ✅ Sync with react-hook-form
      setFeatureInput("");
    }
  };
  
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    setValue("features", updatedFeatures); // ✅ Sync with react-hook-form
  };

  // 🔹 Handle form submission
  async function onSubmit(data: z.infer<typeof productSchema>) {
    setLoading(true);

    // ✅ Get current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      toast.error("User not authenticated!");
      setLoading(false);
      return;
    }

    let imageUrl = null;
    const file = data.image?.[0];

    // ✅ Upload image to Supabase Storage
    if (file) {
      const { success, error, imageUrl: uploadedImageUrl } = await uploadProductImage(file);
      if (!success) {
        console.log(error);
        
        toast.error(error || "Image upload failed");
        setLoading(false);
        return;
      }
      imageUrl = uploadedImageUrl;
    }

    // ✅ Insert product into database
    const { success, error } = await addProduct({
      user_id: user.user.id,
      name: data.name,
      price: parseFloat(data.price),
      description: data.description,
      category_id: data.categoryId, // 🔹 Include selected category
      quantity: data.quantity, // ✅ Include quantity
      features,
      image: imageUrl || undefined,
    });

    if (!success) {
      toast.error(error || "Failed to add product");
    } else {
      toast.success("Product added successfully!");
      reset();
      onProductAdded();
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="border p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add a Product</h2>

        <div className="mb-4">
          <Label>Name</Label>
          <Input type="text" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <Label>Price</Label>
          <Input type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div className="mb-4">
          <Label>Description</Label>
          <Textarea {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        {/* ✅ Category Selection */}
        <div className="mb-4">
          <Label>Category</Label>
          <Select onValueChange={(value) => setValue("categoryId", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
        </div>
        
        {/* Event Features */}
        <div className="mb-4">
            <Label>Event Highlights</Label>
            <div className="flex gap-2">
              <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add a feature" />
              <Button type="button" onClick={handleAddFeature}>
                Add
              </Button>
            </div>
            {features.length > 0 && (
              <ul className="mt-2 space-y-1">
                {features.map((feature, index) => (
                  <li key={index} className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    {feature}
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveFeature(index)}>
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {errors.features && <p className="text-red-500 text-sm">{errors.features.message as string}</p>}
          </div>

         {/* ✅ Quantity Input */}
         <div className="mb-4">
          <Label>Quantity</Label>
          <Input type="number" min="0" {...register("quantity")} />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
        </div>

        <div className="mb-4">
          <Label>Image</Label>
          <Input type="file" accept="image/*" {...register("image")} />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message as string}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
}

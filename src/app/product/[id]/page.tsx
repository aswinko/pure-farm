import { getCategoryById, getProductById } from "@/app/actions/product-actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/layout/Navbar";

interface Params {
  params: { id: string };
}

const ProductDetailsPage = async ({ params }: Params) => {
    const id = params.id;
    if (!id){
        return <div>Not found</div>
    }
  const product = await getProductById(id);
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
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          Product not found
        </h2>
      </div>
    );
  }

  return (
    <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
        {/* Product Image */}
        <div className="relative w-full h-[450px] rounded-lg overflow-hidden shadow-lg">
            <Image
            src={product.image || ''}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
            />
        </div>

        {/* Product Details */}
        <div className="space-y-4">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {product.description}
            </p>
        </div>

        {/* Price & Product Type */}
        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
            <span className="text-lg text-gray-600">Qty: {product.quantity}</span>
            <span className="text-gray-600 dark:text-gray-400">
            Category: <span className="font-semibold">{category?.name || "N/A"}</span>
            </span>
        </div>

        {/* Seller Info */}
        {/* <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md gap-4">
            <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Seller" />
            <AvatarFallback>AK</AvatarFallback>
            </Avatar>
            <div>
            <h3 className="text-lg font-semibold">Aswin K O</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Verified Seller</p>
            </div>
        </div> */}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button className="w-full dark:text-white dark:bg-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition">
            Buy Now
            </Button>
            <Button
            variant={"outline"}
            className="w-full border-gray-500 dark:text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
            >
            Add to Cart
            </Button>
        </div>
        </div>
    </>
  );
};

export default ProductDetailsPage;

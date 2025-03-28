
import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import Link from "next/link";


interface ProductSliderProps {
  products: Product[];
}   

export const ProductSlider: React.FC<ProductSliderProps> = ({products}) => {
  return (
    <Carousel className="w-full max-w-full">
      <CarouselContent className="-ml-1">
        {products?.map((product) => (
          <CarouselItem key={product.id} className="pl-1 md:basis-1/2 lg:basis-1/6">
          <Link href={`product/${product.id}`} >
            <div className="p-1">
              <Card className="rounded-lg overflow-hidden shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-4">
                  {/* Product Image */}
                  <div className="relative w-32 h-32 mb-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded-lg"
                    />
                  </div>
                  {/* Product Name */}
                  <h3 className="text-lg font-medium text-center">{product.name}</h3>
                  {/* Price */}
                  <p className="text-sm text-gray-600 mt-1">${product.price}</p>
                  {/* Add to Cart Button */}
                  <Button variant="default" className="mt-3 w-full">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-2" />
      <CarouselNext className="absolute right-2" />
    </Carousel>
  );
}

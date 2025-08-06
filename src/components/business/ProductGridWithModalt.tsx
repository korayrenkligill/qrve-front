"use client";

import { useEffect, useState } from "react";
import ProductDetailModal from "./ProductDetailModal"; // detay modalı
import { Oleo_Script } from "next/font/google";
import { Donut, Pointer } from "lucide-react";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";

const oleoScript = Oleo_Script({
  subsets: ["latin"],
  weight: ["700", "400"],
});

interface Props {
  products: ProductResponseType[];
}

export default function ProductGridWithModal({ products }: Props) {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponseType | null>(null);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 mb-12">
        {products.map((product) => {
          if (!product.isActive) return null;
          return (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
                setOpened(true);
              }}
              className="text-yellow-950 h-[400px] relative flex flex-col justify-end rounded-2xl overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-4 right-4 text-white z-20 bg-black/50 rounded-lg p-1 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Pointer size={20} color="white" />
              </div>
              {product.imageUrl &&
              product.imageUrl !== "" &&
              !product.imageUrl.startsWith("/") ? (
                <img
                  src={product.imageUrl}
                  alt="product"
                  className="absolute top-0 left-0 w-full h-full object-cover z-0"
                />
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0 opacity-10">
                  <Donut size={80} color="#894b00" />
                </div>
              )}
              <div className="absolute h-full w-full bottom-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
              <div className="flex flex-col relative z-20 p-4">
                <div className="flex items-center justify-between">
                  <div className="">
                    <p
                      className={`${oleoScript.className} font-bold text-2xl text-white`}
                    >
                      {product.name}
                    </p>
                  </div>
                  <p
                    className={`${oleoScript.className} font-bold text-2xl text-white`}
                  >
                    {product.price} ₺
                  </p>
                </div>
                <p className="text-white opacity-80">{product.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <ProductDetailModal
        opened={opened}
        onClose={() => setOpened(false)}
        product={selectedProduct}
      />
    </>
  );
}

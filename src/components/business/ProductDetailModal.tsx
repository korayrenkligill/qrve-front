"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Donut, Dot, WineOff } from "lucide-react";
import { Oleo_Script } from "next/font/google";
import DividerHeader from "./DividerHeader";
import { Popover, Text } from "@mantine/core";
import { useEffect } from "react";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";

const oleoScript = Oleo_Script({
  subsets: ["latin"],
  weight: ["700", "400"],
});

interface Props {
  opened: boolean;
  onClose: () => void;
  product: ProductResponseType | null;
}

export default function ProductDetailModal({
  opened,
  onClose,
  product,
}: Props) {
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened]);
  return (
    <AnimatePresence>
      {opened && product && (
        <motion.div
          key="product-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-black/60 backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-[999] flex items-center justify-center`}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#fff8e3] rounded-lg max-w-2xl w-full p-4 pb-12 flex flex-col items-center m-2 max-h-[70vh] overflow-auto"
          >
            {product.imageUrl &&
              product.imageUrl !== "" &&
              !product.imageUrl.startsWith("/") && (
                <div className=" h-[250px] w-[250px] rounded-2xl overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt="product"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            <div className="flex flex-col relative z-20 p-4 w-full">
              <div className="flex items-center justify-between">
                <div className="">
                  <p className={`font-bold text-3xl text-yellow-950`}>
                    {product.name}
                  </p>
                </div>
                <p className={`font-bold text-3xl text-yellow-950`}>
                  {product.price} ₺
                </p>
              </div>
              <p className={`font-normal text-yellow-900`}>
                {product.description}
              </p>
            </div>
            {product.variants.length > 0 && (
              <>
                <div className="w-full">
                  <DividerHeader header="Çeşitler" fontSize="text-2xl" />
                </div>
                <div className="flex flex-col w-full text-yellow-900">
                  {product.variants
                    .sort((a, b) => a.additionalPrice - b.additionalPrice)
                    .map((variant) => (
                      <div key={variant.id} className="flex items-center gap-2">
                        <Dot size={20} strokeWidth={8} color="#733e0a" />
                        <p className="text-xl">{variant.name}</p>
                        <div className="flex-1 h-[14px] border-b-4 border-dotted border-yellow-900/50"></div>
                        {variant.additionalPrice > 0 && (
                          <p className="text-xl">
                            + {variant.additionalPrice} ₺
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </>
            )}
            {product.options.length > 0 && (
              <>
                <div className="w-full">
                  <DividerHeader header="Ekstralar" fontSize="text-2xl" />
                </div>
                <div className="flex flex-col w-full text-yellow-900">
                  {product.options
                    .sort((a, b) => a.extraPrice - b.extraPrice)
                    .map((option) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Dot size={20} strokeWidth={8} color="#733e0a" />
                        <p className="text-xl">{option.optionName}</p>
                        <div className="flex-1 h-[14px] border-b-4 border-dotted border-yellow-900/50"></div>
                        {option.extraPrice > 0 && (
                          <p className="text-xl">+ {option.extraPrice} ₺</p>
                        )}
                      </div>
                    ))}
                </div>
              </>
            )}
            {product.contents.length > 0 && (
              <>
                <div className="w-full">
                  <DividerHeader header="İçindekiler" fontSize="text-2xl" />
                </div>
                <div className="flex flex-col w-full text-yellow-900">
                  {product.contents.map((content) => (
                    <div key={content.id} className="flex items-center gap-2">
                      <Dot size={20} strokeWidth={8} color="#733e0a" />
                      <p className="text-xl">{content.name}</p>
                      {content.isAllergen && (
                        <Popover
                          width={200}
                          position="bottom"
                          withArrow
                          shadow="md"
                          zIndex={9999}
                        >
                          <Popover.Target>
                            <WineOff size={20} color="red" />
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Text size="xs">
                              Bu ürün bazı insanlarda alerjik tepkime
                              yaratabilmektedir.
                            </Text>
                          </Popover.Dropdown>
                        </Popover>
                      )}
                      <div className="flex-1 h-[14px] border-b-4 border-dotted border-yellow-900/50"></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import ProductGridWithModal from "./ProductGridWithModalt";
import DividerHeader from "./DividerHeader";
import { BusinessResponseType } from "@/interfaces/BusinessContainer/Business/BusinessResponseType";

interface Props {
  categories: BusinessResponseType["categories"];
}

export default function BusinessMenuAccordion({ categories }: Props) {
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([]);

  // Başlangıçta tüm kategorileri açık hale getir
  useEffect(() => {
    const allCategoryIds = categories.map((c) => c.id);
    setOpenCategoryIds(allCategoryIds);
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="flex flex-col">
      {categories
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((category) => {
          if (category.products.length === 0) return null;

          const isOpen = openCategoryIds.includes(category.id);

          return (
            <div key={category.id} className="mb-4">
              <div onClick={() => toggleCategory(category.id)}>
                <DividerHeader header={category.name} />
              </div>

              {isOpen && (
                <div className="mt-2 px-2">
                  <ProductGridWithModal products={category.products} />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

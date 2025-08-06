"use client";

import { categoryApi } from "@/api/categoryApi";
import PanelHeader from "@/components/panel/panelHeader";
import { CreateCategoryType } from "@/interfaces/ProductContainer/Category/CreateCategoryType";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [categoryForm, setCategoryForm] = useState<CreateCategoryType>({
    businessId: "",
    name: "",
    order: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const selectedBusiness = useAtomValue(selectedBusinessAtom);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) {
      window.location.reload();
      return;
    }
    setIsLoading(true);

    const _categoryForm: CreateCategoryType = {
      ...categoryForm,
      businessId: selectedBusiness.id,
    };

    const categoryPromise = categoryApi.createCategory(_categoryForm);

    toast.promise(
      categoryPromise,
      {
        loading: "Kategori oluşturuluyor...",
        success: (res) => {
          return res.message || "Kategori oluşturdu!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "category-create-toast",
      }
    );
    try {
      await categoryPromise;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Kategori Ekle" />
      <main className="p-2 flex-1">
        <form className="flex flex-col gap-3" onSubmit={handleCreateCategory}>
          <TextInput
            required
            placeholder="Örn: Soğuk İçecekler"
            label="Kategori adı"
            description="Menüde görünecek kategori adı"
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm((old) => ({
                ...old,
                name: e.target.value,
              }))
            }
          />
          <NumberInput
            label="Sıra"
            description="Kategorinizin menüdeki sıra numarası"
            placeholder="Örn: 1"
            value={categoryForm.order}
            onChange={(e) =>
              setCategoryForm((prev) => ({ ...prev, order: Number(e) }))
            }
          />

          <Button
            color="green"
            leftSection={<Plus size={18} strokeWidth={3} />}
            type="submit"
            loading={isLoading}
            disabled={categoryForm.name === ""}
          >
            Kategori Ekle
          </Button>
        </form>
      </main>
    </div>
  );
};

export default page;

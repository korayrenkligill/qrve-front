"use client";

import { categoryApi } from "@/api/categoryApi";
import PanelHeader from "@/components/panel/panelHeader";
import { UpdateCategoryType } from "@/interfaces/ProductContainer/Category/UpdateCategoryType";
import { Button, NumberInput, TextInput } from "@mantine/core";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const initialForm = useRef<UpdateCategoryType>({
    id: "",
    name: "",
    order: 0,
  });
  const [categoryForm, setCategoryForm] = useState<UpdateCategoryType>({
    id: "",
    name: "",
    order: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const getUpdatedFields = (
    initial: UpdateCategoryType,
    current: UpdateCategoryType
  ): Partial<UpdateCategoryType> & { id: string } => {
    const updated: Partial<UpdateCategoryType> & { id: string } = {
      id: current.id,
    };

    (Object.keys(current) as (keyof UpdateCategoryType)[]).forEach((key) => {
      if (key === "id") return;
      if (initial[key] !== current[key]) {
        (updated as any)[key] = current[key];
      }
    });

    return updated;
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedFields = getUpdatedFields(initialForm.current, categoryForm);
    const promise = categoryApi.update(updatedFields);

    toast.promise(
      promise,
      {
        loading: "Kategori düzenleniyor...",
        success: (res) => {
          return res.message || "Kategori başarıyla düzenlendi!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "category-update-toast",
      }
    );
    try {
      await promise;
    } finally {
      setIsLoading(false);
    }
  };

  const getCategory = async () => {
    if (!id) {
      router.push("/panel/categories");
      return;
    }
    if (typeof id !== "string") return;
    setIsLoading(true);
    try {
      const businessUser = await categoryApi.getById(id);
      if (businessUser.data) {
        setCategoryForm({
          id: businessUser.data.id,
          name: businessUser.data.name,
          order: businessUser.data.order,
        });
        initialForm.current = {
          id: businessUser.data.id,
          name: businessUser.data.name,
          order: businessUser.data.order,
        };
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "category-get-error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, [id]);
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Kategori düzenle" />
      <main className="p-2 flex-1">
        <form className="flex flex-col gap-3" onSubmit={handleUpdateCategory}>
          <TextInput
            required
            placeholder="Örn: Atıştırmalıklar"
            label="Kategori adı"
            description="Menüde gösterilecek kategori adı"
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
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
            leftSection={<Save size={18} strokeWidth={3} />}
            type="submit"
            loading={isLoading}
            disabled={categoryForm.name === ""}
          >
            Kaydet
          </Button>
        </form>
      </main>
    </div>
  );
};

export default page;

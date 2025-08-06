"use client";

import { categoryApi } from "@/api/categoryApi";
import { productApi } from "@/api/productApi";
import PanelHeader from "@/components/panel/panelHeader";
import { CategoryResponseWithoutProductType } from "@/interfaces/ProductContainer/Category/CategoryResponseWithoutProductType";
import { CreateProductType } from "@/interfaces/ProductContainer/Product/CreateProductType";
import { UpdateProductType } from "@/interfaces/ProductContainer/Product/UpdateProductType";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import {
  Alert,
  Button,
  Checkbox,
  Loader,
  NativeSelect,
  NumberInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useAtomValue } from "jotai";
import { Plus, TriangleAlert, TurkishLira } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [categories, setCategories] = useState<
    CategoryResponseWithoutProductType[]
  >([]);

  const initialForm = useRef<UpdateProductType>({
    id: "",
    categoryId: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    isActive: true,
    order: 0,
  });
  const [productForm, setProductForm] = useState<UpdateProductType>({
    id: "",
    categoryId: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    isActive: true,
    order: 0,
  });

  const selectedBusiness = useAtomValue(selectedBusinessAtom);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  const getUpdatedFields = (
    initial: UpdateProductType,
    current: UpdateProductType
  ): Partial<UpdateProductType> & { id: string } => {
    const updated: Partial<UpdateProductType> & { id: string } = {
      id: current.id,
    };

    (Object.keys(current) as (keyof UpdateProductType)[]).forEach((key) => {
      if (key === "id") return;
      if (initial[key] !== current[key]) {
        (updated as any)[key] = current[key];
      }
    });

    return updated;
  };

  const handleChange = (
    field: keyof CreateProductType,
    value: string | number | boolean
  ) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getCategories = async () => {
    if (!selectedBusiness) return;
    setLoading(true);
    try {
      const response = await categoryApi.getByBusinessId(selectedBusiness.id);
      if (response.data) {
        if (response.data.length === 0) {
          return;
        }
        setCategories(response.data);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "category-get-error" });
    } finally {
      await getProduct();
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setButtonLoading(true);

    if (!categories.some((c) => c.id === productForm.categoryId)) {
      toast.error("Kategori bulunamadı", { id: "category-get-error" });
    }
    const updatedFields = getUpdatedFields(initialForm.current, productForm);
    const promise = productApi.update(updatedFields);

    toast.promise(
      promise,
      {
        loading: "Ürün düzenleniyor...",
        success: (res) => {
          return res.message || "Ürün düzenlendi!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "product-update-toast",
      }
    );
    try {
      await promise;
    } finally {
      setButtonLoading(false);
    }
  };

  const getProduct = async () => {
    if (!id) {
      router.push("/panel/products");
      return;
    }
    if (typeof id !== "string") return;
    setLoading(true);
    try {
      const businessUser = await productApi.getById(id);
      if (businessUser.data) {
        setProductForm({
          id: businessUser.data.id,
          categoryId: businessUser.data.categoryId,
          name: businessUser.data.name,
          description: businessUser.data.description,
          price: businessUser.data.price,
          imageUrl: businessUser.data.imageUrl,
          isActive: businessUser.data.isActive,
          order: businessUser.data.order,
        });
        initialForm.current = {
          id: businessUser.data.id,
          categoryId: businessUser.data.categoryId,
          name: businessUser.data.name,
          description: businessUser.data.description,
          price: businessUser.data.price,
          imageUrl: businessUser.data.imageUrl,
          isActive: businessUser.data.isActive,
          order: businessUser.data.order,
        };
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "product-get-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [selectedBusiness]);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Ürün Düzenle" />
      {loading ? (
        <main className="p-2 flex-1 flex items-center justify-center">
          <Loader />
        </main>
      ) : (
        <main className="p-2 flex-1">
          <form className="flex flex-col gap-3" onSubmit={handleUpdateProduct}>
            <NativeSelect
              required
              label="Kategori Seç"
              description="Ürünün ait olduğu kategoriyi seçin"
              value={productForm.categoryId}
              onChange={(e) =>
                handleChange("categoryId", e.currentTarget.value)
              }
              data={categories.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
            <TextInput
              required
              placeholder="Örn: Filtre Kahve"
              label="Ürün Adı"
              description="Menüde görünecek ürün adı"
              value={productForm.name}
              onChange={(e) => handleChange("name", e.currentTarget.value)}
            />
            <Textarea
              label="Ürün Açıklaması"
              description="Ürün hakkında kısa ve bilgilendirici bir açıklama yazın"
              placeholder="Örn: Özenle demlenmiş sıcak filtre kahve"
              autosize
              minRows={4}
              maxRows={10}
              value={productForm.description}
              onChange={(e) =>
                handleChange("description", e.currentTarget.value)
              }
            />
            <NumberInput
              required
              label="Fiyat"
              description="Ürünün satış fiyatını belirleyin (₺)"
              placeholder="Örn: 45"
              leftSection={<TurkishLira size={18} />}
              value={productForm.price}
              onChange={(e) => handleChange("price", e)}
            />
            <TextInput
              placeholder="Örn: https://cdn.site.com/images/filtre-kahve.png"
              label="Görsel Bağlantısı"
              description="Ürünün görselini temsil eden bir URL girin"
              value={productForm.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.currentTarget.value)}
            />
            <Checkbox
              checked={productForm.isActive}
              onChange={(e) =>
                handleChange("isActive", e.currentTarget.checked)
              }
              label="Ürün aktif mi?"
            />
            <NumberInput
              required
              label="Menü Sırası"
              description="Ürünün menüde kaçıncı sırada görüneceğini belirtin"
              placeholder="Örn: 3"
              value={productForm.order}
              onChange={(e) => handleChange("order", e)}
            />
            <Button
              color="green"
              leftSection={<Plus size={18} strokeWidth={3} />}
              type="submit"
              loading={buttonLoading}
              // disabled={employeeForm.email === ""}
            >
              Çalışan Ekle
            </Button>
          </form>
        </main>
      )}
    </div>
  );
};

export default page;

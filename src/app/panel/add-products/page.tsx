"use client";

import { categoryApi } from "@/api/categoryApi";
import { productApi } from "@/api/productApi";
import PanelHeader from "@/components/panel/panelHeader";
import { CategoryResponseWithoutProductType } from "@/interfaces/ProductContainer/Category/CategoryResponseWithoutProductType";
import { CreateProductType } from "@/interfaces/ProductContainer/Product/CreateProductType";
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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const page = (props: Props) => {
  const router = useRouter();

  const [categories, setCategories] = useState<
    CategoryResponseWithoutProductType[]
  >([]);

  const [productForm, setProductForm] = useState<CreateProductType>({
    businessId: "",
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
        handleChange("categoryId", response.data[0].id);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "category-get-error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) {
      window.location.reload();
      return;
    }
    setButtonLoading(true);

    const _productForm: CreateProductType = {
      ...productForm,
      businessId: selectedBusiness.id,
    };

    if (!categories.some((c) => c.id === _productForm.categoryId)) {
      toast.error("Kategori bulunamadı", { id: "category-get-error" });
    }

    const categoryPromise = productApi.createProduct(_productForm);

    toast.promise(
      categoryPromise,
      {
        loading: "Ürün oluşturuluyor...",
        success: (res) => {
          return (
            res.message || "Ürün oluşturdu, Ürün detaylarını ekleyebilirsiniz!"
          );
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "product-create-toast",
      }
    );
    try {
      await categoryPromise;
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [selectedBusiness]);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Ürün Ekle" />
      {loading ? (
        <main className="p-2 flex-1 flex items-center justify-center">
          <Loader />
        </main>
      ) : categories.length < 1 ? (
        <main className="p-2 flex-1 flex items-center justify-center">
          <Alert
            variant="light"
            color="blue"
            title="Uyarı"
            icon={<TriangleAlert />}
          >
            <Text>Ürün eklemek için önce kategori eklemelisiniz!</Text>
            <div className="mt-4">
              <Button
                size="xs"
                className="ml-auto"
                onClick={() => router.push("/panel/add-categories")}
              >
                Kategori Ekle
              </Button>
            </div>
          </Alert>
        </main>
      ) : (
        <main className="p-2 flex-1">
          <form className="flex flex-col gap-3" onSubmit={handleCreateProduct}>
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

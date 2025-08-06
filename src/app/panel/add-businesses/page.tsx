"use client";

import { businessApi } from "@/api/businessApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessType } from "@/Enums/BusinessTypes";
import { CreateBusinessType } from "@/interfaces/BusinessContainer/Business/CreateBusinessType";
import {
  Button,
  Input,
  NativeSelect,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Plus } from "lucide-react";
import { number } from "motion";
import React, { useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [businessForm, setBusinessForm] = useState<CreateBusinessType>({
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    type: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof CreateBusinessType, value: string) => {
    setBusinessForm((prev) => ({
      ...prev,
      [field]: field === "type" ? Number(value) : value,
    }));
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const promise = businessApi.createBusiness(businessForm);

    toast.promise(
      promise,
      {
        loading: "İşletme oluşturuluyor...",
        success: (res) => {
          return res.message || "İşletme başarıyla oluşturuldu!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "business-create-toast",
      }
    );
    try {
      await promise;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="İşletme Oluştur" />
      <main className="p-2 flex-1">
        <form className="flex flex-col gap-3" onSubmit={handleCreateBusiness}>
          <TextInput
            required
            placeholder="Örn: Pause Coffee House"
            label="İşletme Adı"
            description="İşletmenizin görünen adı"
            value={businessForm.name}
            onChange={(e) => handleChange("name", e.currentTarget.value)}
          />

          <Input.Wrapper
            required
            label="İşletme Adresi (Slug)"
            description="Bu adres üzerinden işletmeniz erişilebilir olacaktır"
          >
            <Input
              component="div"
              styles={{ input: { display: "flex", alignItems: "center" } }}
            >
              <span style={{ whiteSpace: "nowrap", padding: "0 4px" }}>
                qrve.com/
              </span>
              <input
                type="text"
                placeholder="ornek-salon"
                value={businessForm.slug}
                onChange={(e) => handleChange("slug", e.currentTarget.value)}
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  height: "100%",
                  font: "inherit",
                  backgroundColor: "transparent",
                }}
              />
            </Input>
          </Input.Wrapper>

          <Textarea
            label="İşletme Açıklaması"
            description="İşletmeniz hakkında kısa bir açıklama yazın"
            placeholder="Örn: Taze kahveler ve rahat ortam sunan üçüncü nesil kahve dükkanı"
            autosize
            minRows={4}
            maxRows={10}
            value={businessForm.description}
            onChange={(e) => handleChange("description", e.currentTarget.value)}
          />

          <TextInput
            placeholder="Örn: https://cdn.qrve.com/logo.png"
            label="İşletme Logosu"
            description="Logo bağlantı adresi (URL)"
            value={businessForm.logoUrl}
            onChange={(e) => handleChange("logoUrl", e.currentTarget.value)}
          />

          <NativeSelect
            required
            label="İşletme Türü"
            description="İşletmenizin ait olduğu kategori"
            value={businessForm.type.toString()} // string olarak gönderilmeli
            onChange={(e) => handleChange("type", e.currentTarget.value)} // tekrar number'a çevir
            data={Object.entries(BusinessType)
              .filter(([key, value]) => !isNaN(Number(value))) // '0' gibi enum değerlerini dahil eder
              .map(([key, value]) => ({
                label: key
                  .replace(/([a-z])([A-Z])/g, "$1 $2") // IceCreamShops -> Ice Cream Shops
                  .replace(/([A-Z])/g, (m) => m.toUpperCase()), // Büyük harf vurgusu için
                value: value.toString(),
              }))}
          />
          <Button
            color="green"
            leftSection={<Plus size={18} strokeWidth={3} />}
            type="submit"
            loading={isLoading}
            disabled={businessForm.name === "" || businessForm.slug === ""}
          >
            Kaydet
          </Button>
        </form>
      </main>
    </div>
  );
};

export default page;

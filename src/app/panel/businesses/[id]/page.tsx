"use client";

import { businessApi } from "@/api/businessApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessType } from "@/Enums/BusinessTypes";
import { CreateBusinessType } from "@/interfaces/BusinessContainer/Business/CreateBusinessType";
import { UpdateBusinessType } from "@/interfaces/BusinessContainer/Business/UpdateBusinessType";
import {
  Button,
  Input,
  NativeSelect,
  Textarea,
  TextInput,
} from "@mantine/core";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const initialForm = useRef<UpdateBusinessType>({
    id: "",
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    type: 0,
  });
  const [businessForm, setBusinessForm] = useState<UpdateBusinessType>({
    id: "",
    name: "",
    slug: "",
    description: "",
    logoUrl: "",
    type: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof UpdateBusinessType, value: string) => {
    setBusinessForm((prev) => ({
      ...prev,
      [field]: field === "type" ? Number(value) : value,
    }));
  };

  const getUpdatedFields = (
    initial: UpdateBusinessType,
    current: UpdateBusinessType
  ): Partial<UpdateBusinessType> & { id: string } => {
    const updated: Partial<UpdateBusinessType> & { id: string } = {
      id: current.id,
    };

    (Object.keys(current) as (keyof UpdateBusinessType)[]).forEach((key) => {
      if (key === "id") return;
      if (initial[key] !== current[key]) {
        (updated as any)[key] = current[key];
      }
    });

    return updated;
  };

  const handleUpdateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedFields = getUpdatedFields(initialForm.current, businessForm);
    const promise = businessApi.update(updatedFields);

    toast.promise(
      promise,
      {
        loading: "İşletme düzenleniyor...",
        success: (res) => {
          return res.message || "İşletme başarıyla düzenlendi!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "business-update-toast",
      }
    );
    try {
      await promise;
    } finally {
      setIsLoading(false);
    }
  };

  const getBusiness = async () => {
    if (!id) {
      router.push("/panel/businesses");
      return;
    }
    if (typeof id !== "string") return;
    setIsLoading(true);
    try {
      const businessUser = await businessApi.getById(id);
      if (businessUser.data) {
        setBusinessForm({
          id: businessUser.data.id,
          name: businessUser.data.name,
          slug: businessUser.data.slug,
          description: businessUser.data.description,
          logoUrl: businessUser.data.logoUrl,
          type: businessUser.data.type,
        });
        initialForm.current = {
          id: businessUser.data.id,
          name: businessUser.data.name,
          slug: businessUser.data.slug,
          description: businessUser.data.description,
          logoUrl: businessUser.data.logoUrl,
          type: businessUser.data.type,
        };
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "business-get-error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBusiness();
  }, [id]);
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="İşletme düzenle" />
      <main className="p-2 flex-1">
        <form className="flex flex-col gap-3" onSubmit={handleUpdateBusiness}>
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
            value={businessForm.type!.toString()}
            onChange={(e) => handleChange("type", e.currentTarget.value)}
            data={Object.entries(BusinessType)
              .filter(([key, value]) => !isNaN(Number(value)))
              .map(([key, value]) => ({
                label: key
                  .replace(/([a-z])([A-Z])/g, "$1 $2")
                  .replace(/([A-Z])/g, (m) => m.toUpperCase()),
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

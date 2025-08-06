"use client";

import { businessUserApi } from "@/api/businessUserApi";
import { userApi } from "@/api/userApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessUserType } from "@/Enums/BusinessUserTypes";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import { Button, NativeSelect, TextInput } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AddEmployeeType {
  email: string;
  role: BusinessUserType;
}

const page = () => {
  const [employeeForm, setEmployeeForm] = useState<AddEmployeeType>({
    email: "",
    role: BusinessUserType.Staff,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof AddEmployeeType, value: string) => {
    setEmployeeForm((prev) => ({
      ...prev,
      [field]: field === "role" ? Number(value) : value,
    }));
  };

  const selectedBusiness = useAtomValue(selectedBusinessAtom);

  const handleCreateBusinessUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) {
      window.location.reload();
      return;
    }
    setIsLoading(true);

    const userPromise = userApi.getByEmail(employeeForm.email);

    toast.promise(
      userPromise,
      {
        loading: "Kullanıcı aranıyor...",
        success: (res) => {
          return res.message || "Kullanıcı bulundu!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "user-get-toast",
      }
    );
    try {
      const userResp = await userPromise;
      if (userResp.data) {
        const businessPromise = businessUserApi.createBusinessUser({
          businessId: selectedBusiness.id,
          userId: userResp.data.id,
          role: employeeForm.role,
        });

        toast.promise(
          businessPromise,
          {
            loading: "Çalışan oluşturuluyor...",
            success: (res) => {
              return res.message || "Çalışan oluşturuldu!";
            },
            error: (err) =>
              err?.data?.message ||
              err?.response?.data?.message ||
              err?.message ||
              "Bir hata oluştu",
          },
          {
            id: "business-user-create-toast",
          }
        );
        await businessPromise;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Çalışan Ekle" />
      <main className="p-2 flex-1">
        <form
          className="flex flex-col gap-3"
          onSubmit={handleCreateBusinessUser}
        >
          <TextInput
            required
            placeholder="Örn: user@example.com"
            label="Çalışan E-postası"
            description="Çalışanınızın sisteme kayıtlı e-postası"
            value={employeeForm.email}
            onChange={(e) => handleChange("email", e.currentTarget.value)}
          />
          <NativeSelect
            required
            label="Çalışan Rolü"
            description="Çalışanın işletmedeki rolü"
            value={employeeForm.role.toString()}
            onChange={(e) => handleChange("role", e.currentTarget.value)} // tekrar number'a çevir
            data={Object.entries(BusinessUserType)
              .filter(
                ([key, value]) =>
                  !isNaN(Number(value)) &&
                  ![BusinessUserType.Admin, BusinessUserType.User].includes(
                    value as number
                  )
              )
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
            disabled={employeeForm.email === ""}
          >
            Çalışan Ekle
          </Button>
        </form>
      </main>
    </div>
  );
};

export default page;

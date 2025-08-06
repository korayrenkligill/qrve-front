"use client";

import { businessUserApi } from "@/api/businessUserApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessUserType } from "@/Enums/BusinessUserTypes";
import { BusinessUserResponseType } from "@/interfaces/BusinessContainer/BusinessUser/BusinessUserResponseType";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import { Button, NativeSelect, TextInput } from "@mantine/core";
import { useAtomValue } from "jotai";
import { Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [businessUser, setBusinessUser] =
    useState<BusinessUserResponseType | null>(null);
  const [employeeRole, setEmployeeRole] = useState<BusinessUserType>(
    BusinessUserType.Staff
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedBusiness = useAtomValue(selectedBusinessAtom);

  const handleUpdateBusinessUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) {
      window.location.reload();
      return;
    }
    if (!businessUser) {
      toast.error("Kullanıcı bulunamadı", { id: "get-business-user-error" });
      return;
    }
    setIsLoading(true);

    const promise = businessUserApi.update({
      businessId: selectedBusiness.id,
      userId: businessUser.user.id,
      role: employeeRole,
    });

    toast.promise(
      promise,
      {
        loading: "Kullanıcı düzenleniyor...",
        success: (res) => {
          return res.message || "Kullanıcı düzenlendi!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "business-user-update-toast",
      }
    );
    try {
      const userResp = await promise;
      if (userResp.isSuccess) {
        router.push("/panel/employees");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getBusinessUser = async () => {
    if (!id || !selectedBusiness) {
      router.push("/panel/employees");
      return;
    }
    if (typeof id !== "string") return;
    setIsLoading(true);
    try {
      const resp = await businessUserApi.getById(id);
      if (resp.data) {
        setEmployeeRole(resp.data.role);
        setBusinessUser(resp.data);
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "business-create-error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBusinessUser();
  }, [id]);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Çalışan düzenle" />
      <main className="p-2 flex-1">
        <form
          className="flex flex-col gap-3"
          onSubmit={handleUpdateBusinessUser}
        >
          <NativeSelect
            required
            label="Çalışan Rolü"
            description="Çalışanın işletmedeki rolü"
            value={employeeRole}
            onChange={(e) => setEmployeeRole(Number(e.currentTarget.value))} // tekrar number'a çevir
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
            leftSection={<Save size={18} strokeWidth={3} />}
            type="submit"
            loading={isLoading}
          >
            Kaydet
          </Button>
        </form>
      </main>
    </div>
  );
};

export default page;

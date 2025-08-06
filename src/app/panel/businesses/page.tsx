"use client";

import { businessApi } from "@/api/businessApi";
import { businessUserApi } from "@/api/businessUserApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessType } from "@/Enums/BusinessTypes";
import { DetailedBusinessResponseType } from "@/interfaces/BusinessContainer/Business/DetailedBusinessType";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ExternalLink, PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SkeletonBusiness = () => {
  return (
    <div className="flex gap-3 p-3 bg-slate-200/30 rounded-xl shadow-md shadow-slate-600/10">
      <Skeleton height={100} width={100} radius={"md"} />
      <div className="flex flex-col justify-center gap-2">
        <Skeleton height={16} width={150} radius="xl" />
        <Skeleton height={12} width={300} radius="xl" />
        <Skeleton height={40} width={100} radius="md" />
      </div>
    </div>
  );
};

const Page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const [businessList, setBusinessList] = useState<
    DetailedBusinessResponseType[]
  >([]);
  const [selectedBusiness, setSelectedBusiness] =
    useState<DetailedBusinessResponseType | null>(null);
  const [loading, setLoading] = useState(true);

  const getBusinesses = async () => {
    setLoading(true);
    try {
      const response = await businessUserApi.getActiveUserDetailedBusinesses();
      if (response.data) {
        setBusinessList(response.data);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "business-create-error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteBusiness = async (id: string) => {
    setLoading(true);
    await businessApi
      .deleteBusiness(id)
      .then((response) =>
        toast.success(response.message, { id: "business-delete-success" })
      )
      .catch((response) =>
        toast.error(response.message, { id: "business-delete-error" })
      )
      .finally(() => {
        setTimeout(async () => {
          await getBusinesses();
          setLoading(false);
        }, 1000);
      });
  };

  useEffect(() => {
    (async () => await getBusinesses())();
  }, []);
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="İşletmeler" />
      <main className="p-2 flex-1 flex flex-col gap-3">
        {loading ? (
          <div className="flex flex-col gap-3">
            <SkeletonBusiness />
            <SkeletonBusiness />
            <SkeletonBusiness />
          </div>
        ) : (
          businessList.map((item) => {
            const createdDate = new Date(item.createdDate);
            return (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center md:items-stretch gap-3 border border-slate-500/10 p-3 bg-slate-200/30 rounded-xl shadow-md shadow-slate-600/10"
              >
                {item.logoUrl && (
                  <img
                    src={item.logoUrl}
                    alt="business logo"
                    className="w-[100px] h-[100px] rounded-md"
                  />
                )}
                <div className="flex flex-col justify-center items-center md:items-stretch">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{item.name}</h1>
                    <Badge color="green" size="xs" className="translate-y-0.5">
                      {BusinessType[item.type]}
                    </Badge>
                  </div>
                  <p>{item.description}</p>
                  <Button
                    variant="light"
                    size="xs"
                    className="mt-1"
                    onClick={() => window.open(`/${item.slug}`, "_blank")}
                    leftSection={<ExternalLink size={16} />}
                  >
                    Menüyü Görüntüle
                  </Button>
                </div>
                <div className="md:ml-auto flex flex-col justify-between items-center md:items-stretch gap-2">
                  <p className="text-right text-zinc-500">
                    {createdDate.toLocaleDateString("tr-TR")}
                  </p>
                  {item.role === 3 && (
                    <div className="flex items-center justify-end gap-2">
                      <ActionIcon
                        variant="light"
                        aria-label="edit-business"
                        onClick={() =>
                          router.push(`/panel/businesses/${item.id}`)
                        }
                      >
                        <PenLine size={16} />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => {
                          setSelectedBusiness(item);
                          open();
                        }}
                        variant="light"
                        color="red"
                        aria-label="remove-business"
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <Modal opened={opened} onClose={close} title="Emin Misin" centered>
          <Text>
            {selectedBusiness?.name} isletmesini silmek istediginize emin
            misiniz?
          </Text>
          <Group mt={"md"} gap={8} justify="flex-end">
            <Button
              color="red"
              onClick={() => {
                deleteBusiness(selectedBusiness?.id || "");
                close();
              }}
            >
              Evet
            </Button>
            <Button variant="light" onClick={close}>
              İptal
            </Button>
          </Group>
        </Modal>
      </main>
    </div>
  );
};

export default Page;

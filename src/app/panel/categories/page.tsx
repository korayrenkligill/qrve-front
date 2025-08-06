"use client";

import { categoryApi } from "@/api/categoryApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessUserType } from "@/Enums/BusinessUserTypes";
import { CategoryResponseWithoutProductType } from "@/interfaces/ProductContainer/Category/CategoryResponseWithoutProductType";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import roleInBusiness from "@/utils/roleInBusiness";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  HoverCard,
  Menu,
  Modal,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtomValue } from "jotai";
import {
  EllipsisVertical,
  ListOrdered,
  PackageOpen,
  PenLine,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SkeletonCategory = () => {
  return (
    <div className="flex gap-3 p-3 bg-slate-200/30 rounded-xl shadow-md shadow-slate-600/10">
      <Skeleton height={100} width={100} radius={"md"} />
      <div className="flex flex-col justify-center gap-2">
        <Skeleton height={16} width={50} radius="xl" />
        <div className="flex items-center gap-4">
          <Skeleton height={12} width={30} radius="xl" />
          <Skeleton height={12} width={30} radius="xl" />
        </div>
      </div>
    </div>
  );
};

const page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const selectedBusiness = useAtomValue(selectedBusinessAtom);

  const [categories, setCategories] = useState<
    CategoryResponseWithoutProductType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponseWithoutProductType | null>(null);

  const getCategories = async () => {
    if (!selectedBusiness) return;
    setLoading(true);
    try {
      const response = await categoryApi.getByBusinessId(selectedBusiness.id);
      if (response.data) {
        setCategories(response.data);
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

  const deleteCategory = async (id: string) => {
    const promise = categoryApi.deleteCategory(id);
    setLoading(true);
    toast.promise(
      promise,
      {
        loading: "Kullanıcı kaldırılıyor...",
        success: (res) => {
          return res.message || "Kullanıcı kaldırılıdı!";
        },
        error: (err: any) =>
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
      await promise;
    } finally {
      await getCategories();
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Kategoriler" />
      <main className="p-2 flex-1">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {loading ? (
            <>
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
              <SkeletonCategory />
            </>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="flex gap-2 border border-slate-500/10 p-3 bg-slate-200/30 rounded-xl shadow-md shadow-slate-600/10"
              >
                <div className="flex items-center">
                  <Avatar
                    radius="md"
                    size="xl"
                    name={category.name}
                    alt={category.name}
                  />
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <p className="font-semibold text-lg">{category.name}</p>
                  <div className="flex gap-2">
                    <HoverCard width={280} shadow="md">
                      <HoverCard.Target>
                        <Badge color="lime" variant="light" size="lg">
                          <div className="flex items-center gap-2">
                            <ListOrdered size={16} />
                            {category.order}
                          </div>
                        </Badge>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <Text size="sm">Kategorinin menüdeki sırası</Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                    <HoverCard width={280} shadow="md">
                      <HoverCard.Target>
                        <Badge color="teal" variant="light" size="lg">
                          <div className="flex items-center gap-2">
                            <PackageOpen size={16} />
                            {category.productCount}
                          </div>
                        </Badge>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <Text size="sm">Bu kategori altındaki ürün sayısı</Text>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  </div>
                </div>
                {(roleInBusiness() === BusinessUserType.Owner ||
                  roleInBusiness() === BusinessUserType.Admin) && (
                  <div className="ml-auto">
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="light" aria-label="user-actions">
                          <EllipsisVertical size={18} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<PenLine size={16} />}
                          onClick={() =>
                            router.push(`/panel/categories/${category.id}`)
                          }
                        >
                          Düzenle
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          leftSection={<Trash size={16} />}
                          onClick={() => {
                            setSelectedCategory(category);
                            open();
                          }}
                        >
                          Kaldır
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <Modal opened={opened} onClose={close} title="Emin Misin" centered>
          <Text>
            {selectedCategory?.name} kişisini silmek istediginize emin misiniz?
          </Text>
          <Group mt={"md"} gap={8} justify="flex-end">
            <Button
              color="red"
              onClick={() => {
                deleteCategory(selectedCategory?.id || "");
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

export default page;

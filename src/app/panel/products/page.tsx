"use client";

import { productApi } from "@/api/productApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessUserType } from "@/Enums/BusinessUserTypes";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import roleInBusiness from "@/utils/roleInBusiness";
import {
  ActionIcon,
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
  Box,
  Donut,
  EllipsisVertical,
  ListOrdered,
  PenLine,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SkeletonProduct = () => {
  return (
    <div className="flex gap-3 p-3 bg-slate-200/30 rounded-xl shadow-md shadow-slate-600/10">
      <Skeleton height={100} width={100} radius={"md"} />
      <div className="flex flex-col justify-center gap-2">
        <Skeleton height={16} width={50} radius="xl" />
        <Skeleton height={12} width={150} radius="xl" />
      </div>
    </div>
  );
};

const page = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const selectedBusiness = useAtomValue(selectedBusinessAtom);

  const [products, setProducts] = useState<ProductResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponseType | null>(null);
  const getProducts = async () => {
    if (!selectedBusiness) return;
    setLoading(true);
    try {
      const response = await productApi.getByBusinessId(selectedBusiness.id);
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "products-get-error" });
    } finally {
      setLoading(false);
    }
  };

  const changeIsActive = async (id: string, status: boolean) => {
    const promise = productApi.changeIsActive(id, status);
    setLoading(true);
    toast.promise(
      promise,
      {
        loading: "Ürün durumu değiştiriliyor...",
        success: (res) => {
          return res.message || "Ürün durumu değiştirildi!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "product-activate-toast",
      }
    );
    try {
      await promise;
    } finally {
      await getProducts();
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const promise = productApi.deleteProduct(id);
    setLoading(true);
    toast.promise(
      promise,
      {
        loading: "Ürün kaldırılıyor...",
        success: (res) => {
          return res.message || "Ürün kaldırılıdı!";
        },
        error: (err) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "product-delete-toast",
      }
    );
    try {
      await promise;
    } finally {
      await getProducts();
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Ürünler" />
      <main className="p-2 flex-1">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {loading ? (
            <>
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
            </>
          ) : (
            products.map((product) => {
              const _createdDate = new Date(product.createdDate);
              return (
                <div
                  key={product.id}
                  className="border border-slate-500/10 bg-slate-200/30 rounded-xl shadow-md shadow-slate-600/10 text-yellow-950 h-[400px] relative flex flex-col justify-end overflow-hidden group cursor-pointer"
                >
                  {product.imageUrl &&
                  product.imageUrl !== "" &&
                  !product.imageUrl.startsWith("/") ? (
                    <img
                      src={product.imageUrl}
                      alt="product"
                      className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0 opacity-10">
                      <Donut size={80} color="#894b00" />
                    </div>
                  )}
                  <div className="absolute h-full w-full bottom-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
                  <div className="flex flex-col relative z-20 p-4">
                    <p className="text-white/50">
                      {_createdDate.toLocaleDateString("tr-TR")}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="">
                        <p className={`font-bold text-2xl text-white`}>
                          {product.name}
                        </p>
                      </div>
                      <p className={`font-bold text-2xl text-white`}>
                        {product.price} ₺
                      </p>
                    </div>
                    <p className="text-white opacity-80">
                      {product.description}
                    </p>
                    <div className="flex items-center flex-wrap gap-1 mt-2">
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Badge color="teal" variant="light" size="md">
                            <div className="flex items-center gap-2">
                              <Box size={16} />
                              {product.categoryName}
                            </div>
                          </Badge>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">
                            Bu kategori altındaki ürün sayısı
                          </Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Badge color="teal" variant="light" size="md">
                            <div className="flex items-center gap-2">
                              <ListOrdered size={16} />
                              {product.order}
                            </div>
                          </Badge>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">Kategorinin menüdeki sırası</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 z-[10]">
                    <Badge
                      color={product.isActive ? "green" : "red"}
                      size="md"
                      radius="xl"
                    >
                      {product.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                  {(roleInBusiness() === BusinessUserType.Owner ||
                    roleInBusiness() === BusinessUserType.Admin) && (
                    <div className="absolute top-4 right-4 z-[10]">
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon
                            variant="filled"
                            color="blue"
                            aria-label="user-actions"
                          >
                            <EllipsisVertical size={18} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<PenLine size={16} />}
                            onClick={() =>
                              router.push(`/panel/products/${product.id}`)
                            }
                          >
                            Düzenle
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<PenLine size={16} />}
                            onClick={() =>
                              product.isActive
                                ? changeIsActive(product.id, false)
                                : changeIsActive(product.id, true)
                            }
                          >
                            {product.isActive ? "Pasif Yap" : "Aktif Yap"}
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<Trash size={16} />}
                            onClick={() => {
                              setSelectedProduct(product);
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
              );
            })
          )}
        </div>
        <Modal opened={opened} onClose={close} title="Emin Misin" centered>
          <Text>
            {selectedProduct?.name} ürününü silmek istediginize emin misiniz?
          </Text>
          <Group mt={"md"} gap={8} justify="flex-end">
            <Button
              color="red"
              onClick={() => {
                deleteProduct(selectedProduct?.id || "");
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

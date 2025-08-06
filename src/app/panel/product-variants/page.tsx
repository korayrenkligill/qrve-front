"use client";

import { productApi } from "@/api/productApi";
import { productOptionApi } from "@/api/productOptionApi";
import { productVariantApi } from "@/api/productVariantApi";
import PanelHeader from "@/components/panel/panelHeader";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";
import { CreateProductOptionType } from "@/interfaces/ProductContainer/ProductOption/CreateProductOptionType";
import { ProductOptionResponseType } from "@/interfaces/ProductContainer/ProductOption/ProductOptionResponseType";
import { UpdateProductOptionType } from "@/interfaces/ProductContainer/ProductOption/UpdateProductOptionType";
import { CreateProductVariantType } from "@/interfaces/ProductContainer/ProductVariant/CreateProductVariantType";
import { ProductVariantResponseType } from "@/interfaces/ProductContainer/ProductVariant/ProductVariantResponseType";
import { UpdateProductVarintType } from "@/interfaces/ProductContainer/ProductVariant/UpdateProductVariantType";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Group,
  Loader,
  Modal,
  NativeSelect,
  NumberInput,
  Popover,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useAtomValue } from "jotai";
import { Plus, TriangleAlert, TurkishLira } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();

  const [products, setProducts] = useState<ProductResponseType[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const selectedBusiness = useAtomValue(selectedBusinessAtom);
  const [loading, setLoading] = useState(true);

  const [productVariants, setProductVariants] = useState<
    ProductVariantResponseType[]
  >([]);
  const [editRow, setEditRow] = useState<UpdateProductVarintType>({
    id: "",
    name: "",
    additionalPrice: 0,
  });
  const [newVariant, setNewVariant] = useState<CreateProductVariantType>({
    productId: "",
    name: "",
    additionalPrice: 0,
  });
  const [isModalOpen, setModalOpen] = useState(false);

  const getProducts = async () => {
    if (!selectedBusiness) return;
    setLoading(true);
    try {
      const response = await productApi.getByBusinessId(selectedBusiness.id);
      if (response.data) {
        if (response.data.length === 0) {
          return;
        }
        setProducts(response.data);
        setSelectedProductId(response.data[0].id);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "product-get-error" });
    } finally {
      setLoading(false);
    }
  };

  const getProductVariants = async (productId: string) => {
    if (!selectedProductId) return;
    const promise = productVariantApi.getByProductId(productId);

    toast.promise(
      promise,
      {
        loading: "Ürün çeşitleri getiriliyor...",
        success: (res) => {
          return res.message || "Ürün çeşitleri getirildi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productVariant-get-toast",
      }
    );
    try {
      const resp = await promise;
      if (resp.data) {
        setProductVariants(
          resp.data.sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          )
        );
      }
    } catch (error: any) {}
  };

  const handleAdd = async () => {
    if (!selectedProductId) return;
    const _productVariant = { ...newVariant, productId: selectedProductId };
    const promise = productVariantApi.addProductVariant(_productVariant);

    toast.promise(
      promise,
      {
        loading: "Ürün çeşidi ekleniyor...",
        success: (res) => {
          return res.message || "Ürün çeşidi eklendi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productVariant-create-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductVariants(selectedProductId);
    }
    setNewVariant({
      productId: "",
      name: "",
      additionalPrice: 0,
    });
    setModalOpen(false);
  };

  const handleUpdate = async (updateContent: UpdateProductVarintType) => {
    const promise = productVariantApi.updateProductVariant(updateContent);

    toast.promise(
      promise,
      {
        loading: "Ürün çeşidi düzenleniyor...",
        success: (res) => {
          return res.message || "Ürün çeşidi düzenlendi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productVariant-uptade-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductVariants(selectedProductId);
    }
    setEditRow({ id: "", name: "", additionalPrice: 0 });
  };

  const handleDelete = async (id: string) => {
    const promise = productVariantApi.deleteProductVariant(id);

    toast.promise(
      promise,
      {
        loading: "Ürün çeşidi kaldırılıyor...",
        success: (res) => {
          return res.message || "Ürün çeşidi kaldırıldı!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productVariant-delete-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductVariants(selectedProductId);
    }
  };

  useEffect(() => {
    getProducts();
  }, [selectedBusiness]);

  useEffect(() => {
    if (!selectedProductId) return;
    getProductVariants(selectedProductId);
  }, [selectedProductId]);
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Ürün Çeşitleri" />
      {loading ? (
        <main className="p-2 flex-1 flex items-center justify-center">
          <Loader />
        </main>
      ) : products.length < 1 ? (
        <main className="p-2 flex-1 flex items-center justify-center">
          <Alert
            variant="light"
            color="blue"
            title="Uyarı"
            icon={<TriangleAlert />}
          >
            <Text>Önce ürün eklemelisiniz!</Text>
            <div className="mt-4">
              <Button
                size="xs"
                className="ml-auto"
                onClick={() => router.push("/panel/add-products")}
              >
                Ürün Ekle
              </Button>
            </div>
          </Alert>
        </main>
      ) : (
        <main className="p-2 flex-1">
          <div className="flex flex-col gap-3">
            <NativeSelect
              required
              label="Ürün Seç"
              description="Yapılacak işlemlerin tamamı bu ürüne ait olacaktır"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.currentTarget.value)}
              data={products.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
            />
            <Divider my="sm" />
            <Table
              withColumnBorders
              highlightOnHover
              striped
              verticalSpacing="sm"
              horizontalSpacing="md"
            >
              <Table.Thead>
                <Table.Tr className="border-b border-slate-300">
                  <Table.Th className="w-[30%] min-w-[300px] text-left mb-2">
                    Çeşit Adı
                  </Table.Th>
                  <Table.Th className="w-[20%] min-w-[100px] text-left mb-2">
                    Ek Ücret
                  </Table.Th>
                  <Table.Th className="w-[30%] min-w-[100px] text-left mb-2">
                    İşlemler
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {productVariants.map((item) =>
                  editRow?.id === item.id ? (
                    <Table.Tr
                      key={item.id}
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <Table.Td>
                        <TextInput
                          value={editRow.name}
                          size="xs"
                          w="100%"
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              name: e.currentTarget.value,
                            })
                          }
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          value={editRow.additionalPrice}
                          size="xs"
                          w="100%"
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              additionalPrice:
                                typeof e === "string" ? parseFloat(e) : e,
                            })
                          }
                        />
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            onClick={() =>
                              handleUpdate({
                                id: item.id,
                                name: editRow.name,
                                additionalPrice: editRow.additionalPrice,
                              })
                            }
                          >
                            Kaydet
                          </Button>
                          <Button
                            size="xs"
                            variant="default"
                            onClick={() =>
                              setEditRow({
                                id: "",
                                name: "",
                                additionalPrice: 0,
                              })
                            }
                          >
                            İptal
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    <Table.Tr key={item.id}>
                      <Table.Td>{item.name}</Table.Td>
                      <Table.Td className="flex items-center gap-1">
                        {item.additionalPrice} <TurkishLira size={16} />
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => setEditRow(item)}
                          >
                            Düzenle
                          </Button>
                          <Popover
                            width={300}
                            trapFocus
                            position="bottom"
                            withArrow
                            shadow="md"
                          >
                            <Popover.Target>
                              <Button size="xs" color="red" variant="subtle">
                                Sil
                              </Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                              <Text size="sm">Bu işlem geri alınamaz!</Text>
                              <Button
                                fullWidth
                                mt="md"
                                color="red"
                                onClick={() => handleDelete(item.id)}
                              >
                                Sil
                              </Button>
                            </Popover.Dropdown>
                          </Popover>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  )
                )}
              </Table.Tbody>
            </Table>
          </div>
          <>
            <Modal
              opened={isModalOpen}
              onClose={() => setModalOpen(false)}
              title="Yeni İçerik Ekle"
              centered
            >
              <TextInput
                label="Başlık"
                value={newVariant.name}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    name: e.currentTarget.value,
                  })
                }
              />
              <NumberInput
                value={newVariant.additionalPrice}
                size="xs"
                w="100%"
                label="Ek Ücret"
                className="mt-4"
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    additionalPrice: typeof e === "string" ? parseFloat(e) : e,
                  })
                }
              />
              <Button fullWidth mt="md" onClick={handleAdd}>
                Ekle
              </Button>
            </Modal>

            <Button
              leftSection={<Plus size={16} strokeWidth={4} />}
              mt="md"
              onClick={() => setModalOpen(true)}
            >
              Yeni Çeşit Ekle
            </Button>
          </>
        </main>
      )}
    </div>
  );
};

export default page;

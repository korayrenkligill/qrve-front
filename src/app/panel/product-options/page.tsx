"use client";

import { productApi } from "@/api/productApi";
import { productContentApi } from "@/api/productContentApi";
import { productOptionApi } from "@/api/productOptionApi";
import PanelHeader from "@/components/panel/panelHeader";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";
import { CreateProductContentType } from "@/interfaces/ProductContainer/ProductContent/CreateProductContentType";
import { ProductContentResponseType } from "@/interfaces/ProductContainer/ProductContent/ProductContentResponseType";
import { UpdateProductContentType } from "@/interfaces/ProductContainer/ProductContent/UpdateProductContentType";
import { CreateProductOptionType } from "@/interfaces/ProductContainer/ProductOption/CreateProductOptionType";
import { ProductOptionResponseType } from "@/interfaces/ProductContainer/ProductOption/ProductOptionResponseType";
import { UpdateProductOptionType } from "@/interfaces/ProductContainer/ProductOption/UpdateProductOptionType";
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

  const [productOptions, setProductOptions] = useState<
    ProductOptionResponseType[]
  >([]);
  const [editRow, setEditRow] = useState<UpdateProductOptionType>({
    id: "",
    optionName: "",
    extraPrice: 0,
    isRequired: false,
  });
  const [newOption, setNewOption] = useState<CreateProductOptionType>({
    productId: "",
    optionName: "",
    extraPrice: 0,
    isRequired: false,
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

  const getProductOptions = async (productId: string) => {
    if (!selectedProductId) return;
    const promise = productOptionApi.getByProductId(productId);

    toast.promise(
      promise,
      {
        loading: "Ürün ektraları getiriliyor...",
        success: (res) => {
          return res.message || "Ürün ekstraları getirildi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productOption-get-toast",
      }
    );
    try {
      const resp = await promise;
      if (resp.data) {
        setProductOptions(
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
    const _productOption = { ...newOption, productId: selectedProductId };
    const promise = productOptionApi.addProductOption(_productOption);

    toast.promise(
      promise,
      {
        loading: "Ürün ekstrası ekleniyor...",
        success: (res) => {
          return res.message || "Ürün ekstrası eklendi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productOption-create-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductOptions(selectedProductId);
    }
    setNewOption({
      productId: "",
      optionName: "",
      extraPrice: 0,
      isRequired: false,
    });
    setModalOpen(false);
  };

  const handleUpdate = async (updateContent: UpdateProductOptionType) => {
    const promise = productOptionApi.updateProductOption(updateContent);

    toast.promise(
      promise,
      {
        loading: "Ürün ekstrası düzenleniyor...",
        success: (res) => {
          return res.message || "Ürün ekstrası düzenlendi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productOption-uptade-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductOptions(selectedProductId);
    }
    setEditRow({ id: "", optionName: "", extraPrice: 0, isRequired: false });
  };

  const handleDelete = async (id: string) => {
    const promise = productOptionApi.deleteProductOption(id);

    toast.promise(
      promise,
      {
        loading: "Ürün ekstrası kaldırılıyor...",
        success: (res) => {
          return res.message || "Ürün ekstrası kaldırıldı!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productOption-delete-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductOptions(selectedProductId);
    }
  };

  useEffect(() => {
    getProducts();
  }, [selectedBusiness]);

  useEffect(() => {
    if (!selectedProductId) return;
    getProductOptions(selectedProductId);
  }, [selectedProductId]);
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Ürün Ekstraları" />
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
                    Seçenek Adı
                  </Table.Th>
                  <Table.Th className="w-[20%] min-w-[100px] text-left mb-2">
                    Ek Ücret
                  </Table.Th>
                  <Table.Th className="w-[20%] min-w-[100px] text-left mb-2">
                    Zorunluluk
                  </Table.Th>
                  <Table.Th className="w-[30%] min-w-[100px] text-left mb-2">
                    İşlemler
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {productOptions.map((item) =>
                  editRow?.id === item.id ? (
                    <Table.Tr
                      key={item.id}
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <Table.Td>
                        <TextInput
                          value={editRow.optionName}
                          size="xs"
                          w="100%"
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              optionName: e.currentTarget.value,
                            })
                          }
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          value={editRow.extraPrice}
                          size="xs"
                          w="100%"
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              extraPrice:
                                typeof e === "string" ? parseFloat(e) : e,
                            })
                          }
                        />
                      </Table.Td>
                      <Table.Td style={{ textAlign: "center" }}>
                        <Checkbox
                          checked={editRow.isRequired}
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              isRequired: e.currentTarget.checked,
                            })
                          }
                          radius="xs"
                          mx="auto"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            onClick={() =>
                              handleUpdate({
                                id: item.id,
                                optionName: editRow.optionName,
                                isRequired: editRow.isRequired,
                                extraPrice: editRow.extraPrice,
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
                                optionName: "",
                                extraPrice: 0,
                                isRequired: false,
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
                      <Table.Td>{item.optionName}</Table.Td>
                      <Table.Td className="flex items-center gap-1">
                        {item.extraPrice} <TurkishLira size={16} />
                      </Table.Td>
                      <Table.Td>{item.isRequired ? "Evet" : "Hayır"}</Table.Td>
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
                value={newOption.optionName}
                onChange={(e) =>
                  setNewOption({
                    ...newOption,
                    optionName: e.currentTarget.value,
                  })
                }
              />
              <NumberInput
                value={newOption.extraPrice}
                size="xs"
                w="100%"
                label="Ek Ücret"
                className="mt-4"
                onChange={(e) =>
                  setNewOption({
                    ...newOption,
                    extraPrice: typeof e === "string" ? parseFloat(e) : e,
                  })
                }
              />
              <Checkbox
                label="Zorunluluk"
                className="mt-4"
                checked={newOption.isRequired}
                onChange={(e) =>
                  setNewOption({
                    ...newOption,
                    isRequired: e.currentTarget.checked,
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
              Yeni Seçenek Ekle
            </Button>
          </>
        </main>
      )}
    </div>
  );
};

export default page;

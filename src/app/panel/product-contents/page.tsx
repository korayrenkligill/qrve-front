"use client";

import { productApi } from "@/api/productApi";
import { productContentApi } from "@/api/productContentApi";
import PanelHeader from "@/components/panel/panelHeader";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";
import { CreateProductContentType } from "@/interfaces/ProductContainer/ProductContent/CreateProductContentType";
import { ProductContentResponseType } from "@/interfaces/ProductContainer/ProductContent/ProductContentResponseType";
import { UpdateProductContentType } from "@/interfaces/ProductContainer/ProductContent/UpdateProductContentType";
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
  Popover,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useAtomValue } from "jotai";
import { Plus, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();

  const [products, setProducts] = useState<ProductResponseType[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const selectedBusiness = useAtomValue(selectedBusinessAtom);
  const [loading, setLoading] = useState(true);

  const [productContents, setProductContents] = useState<
    ProductContentResponseType[]
  >([]);
  const [editRow, setEditRow] = useState<UpdateProductContentType>({
    id: "",
    name: "",
    isAllergen: false,
  });
  const [newContent, setNewContent] = useState<CreateProductContentType>({
    productId: "",
    name: "",
    isAllergen: false,
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

  const getProductContents = async (productId: string) => {
    if (!selectedProductId) return;
    const promise = productContentApi.getByProductId(productId);

    toast.promise(
      promise,
      {
        loading: "Ürün içerikleri getiriliyor...",
        success: (res) => {
          return res.message || "Ürün içerikleri getirildi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productContent-get-toast",
      }
    );
    try {
      const resp = await promise;
      if (resp.data) {
        setProductContents(
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
    const _productContent = { ...newContent, productId: selectedProductId };
    const promise = productContentApi.addProductContent(_productContent);

    toast.promise(
      promise,
      {
        loading: "Ürün içeriği ekleniyor...",
        success: (res) => {
          return res.message || "Ürün iceriği eklendi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productContent-create-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductContents(selectedProductId);
    }
    setNewContent({ productId: "", name: "", isAllergen: false });
    setModalOpen(false);
  };

  const handleUpdate = async (updateContent: UpdateProductContentType) => {
    const promise = productContentApi.updateProductContent(updateContent);

    toast.promise(
      promise,
      {
        loading: "Ürün içeriği düzenleniyor...",
        success: (res) => {
          return res.message || "Ürün iceriği düzenlendi!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productContent-uptade-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductContents(selectedProductId);
    }
    setEditRow({ id: "", name: "", isAllergen: false });
  };

  const handleDelete = async (id: string) => {
    const promise = productContentApi.deleteProductContent(id);

    toast.promise(
      promise,
      {
        loading: "Ürün içeriği kaldırılıyor...",
        success: (res) => {
          return res.message || "Ürün iceriği kaldırıldı!";
        },
        error: (err: any) =>
          err?.data?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Bir hata oluştu",
      },
      {
        id: "productContent-delete-toast",
      }
    );
    try {
      await promise;
    } finally {
      getProductContents(selectedProductId);
    }
  };

  useEffect(() => {
    getProducts();
  }, [selectedBusiness]);

  useEffect(() => {
    if (!selectedProductId) return;
    getProductContents(selectedProductId);
  }, [selectedProductId]);
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Ürün İçerikleri" />
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
                  <Table.Th className="w-[60%] min-w-[300px] text-left mb-2">
                    Başlık
                  </Table.Th>
                  <Table.Th className="w-[10%] min-w-[100px] text-left mb-2">
                    Alerjik Mi?
                  </Table.Th>
                  <Table.Th className="w-[30%] min-w-[100px] text-left mb-2">
                    İşlemler
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {productContents.map((item) =>
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
                      <Table.Td style={{ textAlign: "center" }}>
                        <Checkbox
                          checked={editRow.isAllergen}
                          onChange={(e) =>
                            setEditRow({
                              ...editRow,
                              isAllergen: e.currentTarget.checked,
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
                                name: editRow.name,
                                isAllergen: editRow.isAllergen,
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
                                isAllergen: false,
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
                      <Table.Td>
                        {item.isAllergen ? "Alerjik" : "Değil"}
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
                value={newContent.name}
                onChange={(e) =>
                  setNewContent({ ...newContent, name: e.currentTarget.value })
                }
              />
              <Checkbox
                label="Alerjik"
                className="mt-4"
                checked={newContent.isAllergen}
                onChange={(e) =>
                  setNewContent({
                    ...newContent,
                    isAllergen: e.currentTarget.checked,
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
              Yeni İçerik Ekle
            </Button>
          </>
        </main>
      )}
    </div>
  );
};

export default page;

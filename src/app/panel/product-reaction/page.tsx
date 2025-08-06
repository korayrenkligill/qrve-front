"use client";

import { productApi } from "@/api/productApi";
import { productLikeApi } from "@/api/productLikeApi";
import PanelHeader from "@/components/panel/panelHeader";
import { ProductResponseType } from "@/interfaces/ProductContainer/Product/ProductResponseType";
import { ProductLikeCompactType } from "@/interfaces/ProductContainer/ProductLike/ProductLikeCompactDto";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import { Badge, Loader, Table } from "@mantine/core";
import { useAtomValue } from "jotai";
import { HeartCrack, Smile } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [products, setProducts] = useState<ProductResponseType[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedBusiness = useAtomValue(selectedBusinessAtom);

  const getCustomers = async () => {
    if (!selectedBusiness) return;
    setLoading(true);
    try {
      const response = await productApi.getByBusinessId(selectedBusiness.id);
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const rows = products.map((element: ProductResponseType) => {
    const date = new Date(element.createdDate);
    const likeCount = element.likes.filter((like) => like.isLiked).length;
    const disslikeCount = element.likes.filter((like) => !like.isLiked).length;
    return (
      <Table.Tr key={element.id}>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.categoryName}</Table.Td>
        <Table.Td>{element.price}</Table.Td>
        <Table.Td>
          <div className="flex gap-2 items-center">
            <Badge color="green" size="lg">
              <div className="flex gap-1 items-center">
                {likeCount} <Smile size={16} />
              </div>
            </Badge>
            <Badge color="red" className="flex gap-1 items-center" size="lg">
              <div className="flex gap-1 items-center">
                {disslikeCount}
                <HeartCrack size={16} />
              </div>
            </Badge>
          </div>
        </Table.Td>
        <Table.Td>{date.toLocaleDateString("tr-TR")}</Table.Td>
      </Table.Tr>
    );
  });

  useEffect(() => {
    if (!selectedBusiness) return;
    getCustomers();
  }, [selectedBusiness]);
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Müşteriler" />
      {loading ? (
        <main className="p-2 flex-1 flex items-center justify-center">
          <Loader />
        </main>
      ) : (
        <main className="p-2 flex-1">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ürün Adı</Table.Th>
                <Table.Th>Kategori Adı</Table.Th>
                <Table.Th>Fiyat</Table.Th>
                <Table.Th>Tepki Sayısı</Table.Th>
                <Table.Th>Tarih</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </main>
      )}
    </div>
  );
};

export default page;

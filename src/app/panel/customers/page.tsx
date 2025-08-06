"use client";

import { productLikeApi } from "@/api/productLikeApi";
import PanelHeader from "@/components/panel/panelHeader";
import { ProductLikeCompactType } from "@/interfaces/ProductContainer/ProductLike/ProductLikeCompactDto";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import { Loader, Table } from "@mantine/core";
import { useAtomValue } from "jotai";
import { HeartCrack, Smile } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
  const [customers, setCustomers] = useState<ProductLikeCompactType[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedBusiness = useAtomValue(selectedBusinessAtom);

  const getCustomers = async () => {
    if (!selectedBusiness) return;
    setLoading(true);
    try {
      const response = await productLikeApi.getByBusinessId(
        selectedBusiness.id
      );
      if (response.data) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const rows = customers.map((element: ProductLikeCompactType) => {
    const date = new Date(element.createdDate);
    return (
      <Table.Tr key={element.userId}>
        <Table.Td>{element.userFullName}</Table.Td>
        <Table.Td>{element.productName}</Table.Td>
        <Table.Td>
          {element.isLiked ? (
            <Smile size={16} color="green" />
          ) : (
            <HeartCrack size={16} color="red" />
          )}
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
                <Table.Th>Kullanıcı</Table.Th>
                <Table.Th>Ürün</Table.Th>
                <Table.Th>Tepki</Table.Th>
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

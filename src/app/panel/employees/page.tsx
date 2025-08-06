"use client";

import { businessUserApi } from "@/api/businessUserApi";
import PanelHeader from "@/components/panel/panelHeader";
import { BusinessUserType } from "@/Enums/BusinessUserTypes";
import { BusinessUserResponseType } from "@/interfaces/BusinessContainer/BusinessUser/BusinessUserResponseType";
import { selectedBusinessAtom } from "@/store/component/panelStore";
import roleInBusiness from "@/utils/roleInBusiness";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  Menu,
  Modal,
  Skeleton,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAtomValue } from "jotai";
import { EllipsisVertical, PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SkeletonEmployee = () => {
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

  const [employees, setEmployees] = useState<BusinessUserResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] =
    useState<BusinessUserResponseType | null>(null);
  const getBusinessUsers = async () => {
    if (!selectedBusiness) return;
    setLoading(true);
    try {
      const response = await businessUserApi.getBusinessUsers(
        selectedBusiness.id
      );
      if (response.data) {
        setEmployees(response.data);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.response?.data?.message ||
        "Bir hata oluştu";
      toast.error(errorMessage, { id: "employee-get-error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteBusinessUser = async (id: string) => {
    const promise = businessUserApi.deleteBusinessUser(id);
    setLoading(true);
    toast.promise(
      promise,
      {
        loading: "Kullanıcı kaldırılıyor...",
        success: (res) => {
          return res.message || "Kullanıcı kaldırılıdı!";
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
      await promise;
    } finally {
      await getBusinessUsers();
      setLoading(false);
    }
  };

  useEffect(() => {
    getBusinessUsers();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Çalışanlar" />
      <main className="p-2 flex-1">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {loading ? (
            <>
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
              <SkeletonEmployee />
            </>
          ) : (
            employees.map((employee) => (
              <div
                key={employee.id}
                className="flex gap-2 border border-slate-500/10 p-3 bg-slate-200/30 rounded-xl shadow-md shadow-slate-600/10"
              >
                <div className="flex items-center">
                  <Avatar
                    radius="md"
                    size="xl"
                    name={employee.user.fullName}
                    alt={employee.user.fullName}
                  />
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <p className="font-semibold text-lg">
                    {employee.user.fullName}
                  </p>
                  <Badge color={employee.role === 3 ? "red" : "blue"}>
                    {BusinessUserType[employee.role]}
                  </Badge>
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
                            router.push(`/panel/employees/${employee.id}`)
                          }
                        >
                          Düzenle
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          leftSection={<Trash size={16} />}
                          onClick={() => {
                            setSelectedEmployee(employee);
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
            {selectedEmployee?.user.fullName} kişisini silmek istediginize emin
            misiniz?
          </Text>
          <Group mt={"md"} gap={8} justify="flex-end">
            <Button
              color="red"
              onClick={() => {
                deleteBusinessUser(selectedEmployee?.id || "");
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

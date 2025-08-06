"use client";

import { businessUserApi } from "@/api/businessUserApi";
import Sidebar from "@/components/panel/sidebar";
import {
  activeUserBusinessesAtom,
  businessesAtom,
  panelLoadingAtom,
  selectedBusinessAtom,
} from "@/store/component/panelStore";
import { Loader } from "@mantine/core";
import { useAtom, useSetAtom } from "jotai";
import { ReactNode, useEffect } from "react";

export default function PanelContainer({ children }: { children: ReactNode }) {
  const [panelLoading, setPanelLoading] = useAtom(panelLoadingAtom);
  const setBusiness = useSetAtom(businessesAtom);
  const setSelectedBusiness = useSetAtom(selectedBusinessAtom);
  const setActiveUserBusinesses = useSetAtom(activeUserBusinessesAtom);

  const getBusinesses = async () => {
    const response = await businessUserApi.getUserBusinesses();
    if (response.data) {
      setActiveUserBusinesses(response.data);
      const businesses = response.data.map((item) => item.business);
      setBusiness(businesses);
      setSelectedBusiness(businesses[0]);
    }
  };

  useEffect(() => {
    (async () => {
      await getBusinesses().finally(() => setPanelLoading(false));
    })();
  }, []);
  if (panelLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

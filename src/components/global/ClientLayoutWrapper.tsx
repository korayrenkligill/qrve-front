"use client";

import { globalStore } from "@/store/globalStore";
import { MantineProvider } from "@mantine/core";
import { Provider } from "jotai";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function ClientLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Provider store={globalStore}>
      <MantineProvider>{children}</MantineProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </Provider>
  );
}

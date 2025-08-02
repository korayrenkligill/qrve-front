"use client";

import { MantineProvider } from "@mantine/core";
import { Provider } from "jotai";
import { ReactNode } from "react";

export default function ClientLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Provider>
      <MantineProvider>{children}</MantineProvider>
    </Provider>
  );
}

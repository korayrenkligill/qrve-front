import PanelContainer from "@/components/panel/panelContainer";
import { ReactNode } from "react";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return <PanelContainer>{children}</PanelContainer>;
}

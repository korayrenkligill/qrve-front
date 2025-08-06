"use client";

import { useScreenSize } from "@/hooks/useScreenSize";
import { panelIsOpenAtom } from "@/store/component/panelStore";
import { HoverCard, Text } from "@mantine/core";
import { useSetAtom } from "jotai";
import { Menu, RefreshCcw } from "lucide-react";
import React from "react";

type Props = {
  title: string;
};
const PanelHeader = ({ title }: Props) => {
  const setPanelIsOpen = useSetAtom(panelIsOpenAtom);

  const { width } = useScreenSize();
  return (
    <div className="w-full border-b border-slate-600/50 flex items-center gap-2 py-2 px-4">
      {width && width < 768 && (
        <div
          className="text-slate-950 w-[30px] h-[30px] flex items-center justify-center rounded-md cursor-pointer"
          onClick={() => setPanelIsOpen(true)}
        >
          <Menu size={24} strokeWidth={2.5} />
        </div>
      )}
      <h1 className="text-lg font-bold text-slate-950">{title}</h1>
    </div>
  );
};

export default PanelHeader;

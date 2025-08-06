import PanelHeader from "@/components/panel/panelHeader";
import { Alert } from "@mantine/core";
import { TriangleAlert } from "lucide-react";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="İstatistikler" />
      <main className="p-2 flex-1">
        <div className="h-full flex items-center justify-center">
          <Alert
            variant="light"
            color="blue"
            title="Yakında"
            icon={<TriangleAlert />}
          >
            İstatistikler yakında eklenecek
          </Alert>
        </div>
      </main>
    </div>
  );
};

export default page;

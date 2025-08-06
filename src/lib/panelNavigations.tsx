import { Box, Building2, UsersRound } from "lucide-react";
import { ReactNode } from "react";

export interface PanelNavigationType {
  label: string;
  icon: ReactNode;
  childrens: {
    label: string;
    href: string;
  }[];
}

export const panelNavigations: PanelNavigationType[] = [
  {
    label: "İşletme Listesi",
    icon: <Building2 size={20} />,
    childrens: [
      { label: "İstatistikler", href: "/panel" },
      { label: "İşletmelerin Listesi", href: "/panel/businesses" },
      { label: "İşletme Ekle", href: "/panel/add-businesses" },
      { label: "Çalışan Listesi", href: "/panel/employees" },
      { label: "Çalışan Ekle", href: "/panel/add-employees" },
    ],
  },
  {
    label: "Ürünler",
    icon: <Box size={20} />,
    childrens: [
      { label: "Kategori Listesi", href: "/panel/categories" },
      { label: "Kategori Ekle", href: "/panel/add-categories" },
      { label: "Ürün Listesi", href: "/panel/products" },
      { label: "Ürün Ekle", href: "/panel/add-products" },
      { label: "Ürün İçerik Listesi", href: "/panel/product-contents" },
      { label: "Ürün Çeşit Listesi", href: "/panel/product-variants" },
      { label: "Ürün Ekstra Listesi", href: "/panel/product-options" },
    ],
  },
  {
    label: "Müşteriler",
    icon: <UsersRound size={20} />,
    childrens: [
      { label: "Tepki Verenler Listesi", href: "/panel/customers" },
      { label: "Ürün Tepki Listesi", href: "/panel/product-reaction" },
    ],
  },
];

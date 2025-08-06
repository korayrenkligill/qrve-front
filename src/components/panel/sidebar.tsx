"use client";

import { BusinessType } from "@/Enums/BusinessTypes";
import { useScreenSize } from "@/hooks/useScreenSize";
import { panelNavigations, PanelNavigationType } from "@/lib/panelNavigations";
import {
  businessesAtom,
  panelIsOpenAtom,
  selectedBusinessAtom,
} from "@/store/component/panelStore";
import { Avatar, Badge, Menu } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { Building2, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const { width } = useScreenSize();
  const pathname = usePathname();

  const [panelIsOpen, setPanelIsOpen] = useAtom(panelIsOpenAtom);
  const businesses = useAtomValue(businessesAtom);
  const [selectedBusiness, setSelectedBusiness] = useAtom(selectedBusinessAtom);

  const [selectedCategory, setSelectedCategory] =
    useState<PanelNavigationType | null>(null);

  const changeCategory = (category: PanelNavigationType) => {
    if (selectedCategory === category) {
      if (width && width < 768) return;
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    if (width && width < 768) {
      setSelectedCategory(panelNavigations[0]);
    } else {
      setPanelIsOpen(true);
    }
  }, [width]);

  useEffect(() => {
    setPanelIsOpen(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {width && width < 768 && !panelIsOpen ? (
        <></>
      ) : (
        <motion.aside
          key="sidebar"
          initial={width && width < 768 ? { opacity: 0 } : { opacity: 100 }}
          animate={{ opacity: 100 }}
          exit={{ opacity: 0 }}
          className={`flex h-screen top-0 fixed md:sticky w-screen md:w-auto z-[9999] ${
            panelIsOpen ? "left-0" : "-left-full"
          }`}
        >
          <div className="h-screen bg-slate-800 flex flex-col gap-2 p-2 relative z-[9999]">
            <Avatar name="Yasin" radius="md" size="md" color="orange" />
            {panelNavigations.map((category) => (
              <button
                key={category.label}
                onClick={() => changeCategory(category)}
                className={`w-[38px] h-[38px] flex items-center justify-center rounded-md ${
                  selectedCategory?.label === category.label
                    ? "bg-slate-100 text-slate-800 hover:bg-slate-100/80"
                    : "bg-slate-800/30 text-slate-100 hover:bg-slate-800"
                }  transition-colors cursor-pointer`}
              >
                {category.icon}
              </button>
            ))}
            <div className="mt-auto ">
              {selectedBusiness && (
                <Menu shadow="md" width={200} zIndex={10000}>
                  <Menu.Target>
                    <Avatar
                      src={selectedBusiness ? selectedBusiness?.logoUrl : ""}
                      name={selectedBusiness.name}
                      radius="md"
                      size="md"
                      color="blue"
                    />
                  </Menu.Target>

                  <Menu.Dropdown>
                    {businesses.map((business) => (
                      <Menu.Item
                        key={business.id}
                        onClick={() => setSelectedBusiness(business)}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            selectedBusiness.id === business.id
                              ? "text-green-700"
                              : ""
                          }`}
                        >
                          <Building2 size={16} />
                          <p>{business.name}</p>
                          <Badge
                            color={
                              selectedBusiness.id === business.id
                                ? "green"
                                : "gray"
                            }
                            size="xs"
                          >
                            {BusinessType[business.type]}
                          </Badge>
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              )}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                initial={{ x: -800 }}
                animate={{ x: 0 }}
                exit={{ x: -800 }}
                transition={{ duration: 0.3 }}
                className="h-screen bg-slate-900 flex flex-col flex-1 md:min-w-[250px] z-[9990]"
              >
                <div className="py-2 px-4 border-b border-slate-600/50 text-white flex items-center gap-2">
                  {selectedCategory.icon}
                  <h2 className="text-lg font-bold">
                    {selectedCategory.label}
                  </h2>
                </div>
                {selectedCategory.childrens.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    onClick={() => setPanelIsOpen(false)}
                    className={`${
                      child.href === pathname ? "bg-slate-800" : ""
                    } py-2 px-4 text-white/80 hover:bg-slate-800/70 transition-colors cursor-pointer`}
                  >
                    {child.label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {width && width < 768 && (
            <div className="absolute top-2 right-5 z-[10000] cursor-pointer">
              <X
                size={30}
                color="white"
                onClick={() => setPanelIsOpen(false)}
              />
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;

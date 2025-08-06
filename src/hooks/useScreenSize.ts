import { useEffect, useState } from "react";

export type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

export function useScreenSize(): { width: number | null; size: ScreenSize } {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setWidth(window.innerWidth);
    handleResize(); // ilk değer

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSize = (w: number | null): ScreenSize => {
    if (w === null) return "md";
    if (w < 576) return "xs";
    if (w < 768) return "sm";
    if (w < 992) return "md";
    if (w < 1200) return "lg";
    return "xl";
  };

  return { width, size: getSize(width) };
}

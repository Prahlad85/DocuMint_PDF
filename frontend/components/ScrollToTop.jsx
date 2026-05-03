"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    // Smooth के बजाय Instant scroll ताकि speed बढ़े
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

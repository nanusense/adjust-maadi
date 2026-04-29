"use client";

import { useMemo } from "react";
import { getDayOfYear } from "@/lib/dates";

export function useDailyRotation<T>(items: T[]): T {
  const dayOfYear = getDayOfYear();
  return useMemo(() => {
    if (!items.length) throw new Error("useDailyRotation: items array is empty");
    return items[dayOfYear % items.length];
  }, [items, dayOfYear]);
}

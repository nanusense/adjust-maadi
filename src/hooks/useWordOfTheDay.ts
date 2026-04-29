"use client";

import { useMemo } from "react";
import { KANNADA_WORDS } from "@/lib/kannada-words";
import { getDayOfYear } from "@/lib/dates";

export function useWordOfTheDay() {
  const dayOfYear = getDayOfYear();
  return useMemo(() => KANNADA_WORDS[dayOfYear % KANNADA_WORDS.length], [dayOfYear]);
}

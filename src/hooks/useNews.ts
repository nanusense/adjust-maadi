"use client";

import { useState, useEffect } from "react";

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  timeAgo: string;
  source: "Deccan Herald" | "Citizen Matters";
  sourceUrl: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => setNews(data.news ?? []))
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  return { news, loading };
}

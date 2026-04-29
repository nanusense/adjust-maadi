import { NextResponse } from "next/server";

export const revalidate = 1800; // 30 minutes

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: "Deccan Herald" | "Citizen Matters";
  sourceUrl: string;
}

function parseRSS(xml: string, source: NewsItem["source"], sourceUrl: string): NewsItem[] {
  const items: NewsItem[] = [];
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  for (const block of blocks) {
    const inner = block[1];
    const title = inner.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() ?? "";
    const link  = inner.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
    const pub   = inner.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";

    if (title && link) {
      items.push({ title, link, pubDate: pub, source, sourceUrl });
    }
  }
  return items;
}

function isBangaloreRelevant(item: NewsItem): boolean {
  const haystack = (item.title + " " + item.link).toLowerCase();
  return /bengaluru|bangalore|karnataka|bbmp|bmtc|namma metro/.test(haystack);
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 60)  return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export async function GET() {
  try {
    const [dhRes, cmRes] = await Promise.all([
      fetch("https://www.deccanherald.com/feed", {
        next: { revalidate: 1800 },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS reader)" },
      }),
      fetch("https://citizenmatters.in/city/bengaluru/feed", {
        next: { revalidate: 1800 },
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS reader)" },
      }),
    ]);

    const [dhXml, cmXml] = await Promise.all([
      dhRes.ok ? dhRes.text() : Promise.resolve(""),
      cmRes.ok ? cmRes.text() : Promise.resolve(""),
    ]);

    const dhItems = parseRSS(dhXml, "Deccan Herald", "https://www.deccanherald.com")
      .filter(isBangaloreRelevant);

    const cmItems = parseRSS(cmXml, "Citizen Matters", "https://citizenmatters.in");

    // Merge, dedupe by title, sort newest first
    const all = [...dhItems, ...cmItems];
    const seen = new Set<string>();
    const deduped = all.filter((item) => {
      const key = item.title.toLowerCase().slice(0, 60);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    deduped.sort((a, b) => {
      const ta = new Date(a.pubDate).getTime() || 0;
      const tb = new Date(b.pubDate).getTime() || 0;
      return tb - ta;
    });

    const news = deduped.slice(0, 10).map((item) => ({
      ...item,
      timeAgo: timeAgo(item.pubDate),
    }));

    return NextResponse.json({ news, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json({ news: [], updatedAt: new Date().toISOString() });
  }
}

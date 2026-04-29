import { NextResponse } from "next/server";

export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "History_of_Bangalore";

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      {
        headers: { "User-Agent": "AdjustMaadi-Portal (sandeepnanu@gmail.com)" },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) throw new Error(`Wikipedia returned ${res.status}`);

    const data = await res.json();
    return NextResponse.json({
      title: data.title,
      extract: data.extract,
      thumbnail: data.thumbnail?.source,
      content_urls: data.content_urls,
      description: data.description,
    });
  } catch {
    return NextResponse.json({
      title: "History of Bangalore",
      extract: "Bengaluru, known as the Silicon Valley of India, has a rich history spanning over 500 years. Founded by Kempe Gowda I in 1537, the city grew from a small mud fort to become one of Asia's most dynamic metropolitan areas. From the gardens of Tipu Sultan to the campuses of Infosys, Bengaluru's story is one of beauty, culture, and relentless innovation.",
      thumbnail: null,
      fallback: true,
    });
  }
}

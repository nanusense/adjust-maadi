import { NextResponse } from "next/server";
import { BANGALORE_BIRDS } from "@/lib/bangalore-birds";

export const revalidate = 3600; // 1 hour

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export async function GET() {
  const bird = BANGALORE_BIRDS[getDayOfYear() % BANGALORE_BIRDS.length];

  let photo: string | null = null;
  let attribution: string | null = null;

  try {
    const res = await fetch(
      `https://api.inaturalist.org/v1/taxa/${bird.taxonId}`,
      { next: { revalidate: 86400 } }
    );
    if (res.ok) {
      const data = await res.json();
      const defaultPhoto = data.results?.[0]?.default_photo;
      if (defaultPhoto?.url) {
        // iNaturalist returns square thumbnails — swap to medium for a usable size
        photo = (defaultPhoto.url as string).replace("square", "medium");
        attribution = defaultPhoto.attribution ?? null;
      }
    }
  } catch {
    // graceful fallback — bird data is still returned without a photo
  }

  return NextResponse.json({ ...bird, photo, attribution });
}

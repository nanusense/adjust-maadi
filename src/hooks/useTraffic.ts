"use client";

import { useState, useEffect } from "react";
import { LiveCorridor } from "@/app/api/traffic/route";

export type { LiveCorridor };

export function useTraffic() {
  const [corridors, setCorridors] = useState<LiveCorridor[]>([]);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/traffic")
      .then((r) => r.json())
      .then((d) => {
        setCorridors(d.corridors ?? []);
        setLive(d.live ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { corridors, live, loading };
}

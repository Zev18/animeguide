"use client";

import { getAnimeDetailsClient } from "@/utils/utils";
import { useEffect, useState } from "react";

export default function GuidesTab({
  username,
  guides,
}: {
  username: string;
  guides: Record<string, any>[];
}) {
  const [testAnime, setTestAnime] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      console.log(await getAnimeDetailsClient(1));
    };

    fetchAnime();
  }, []);

  return (
    <div>
      <pre></pre>
    </div>
  );
}

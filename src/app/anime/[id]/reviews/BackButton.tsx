"use client";

import React from "react";
import { ChevronLeft } from "react-feather";
import { Image } from "@nextui-org/image";
import { useRouter } from "next/navigation";

export default function BackButton({ anime }: { anime: Record<string, any> }) {
  const router = useRouter();

  return (
    <div
      className="flex cursor-pointer items-center gap-4 text-primary"
      onClick={() => router.push(`/anime/${anime.id}`)}
    >
      <ChevronLeft />
      <Image src={anime.main_picture.medium} alt={anime.title} width={50} />
      <div className="flex flex-col gap-1">
        <h2 className="text-xl">Back</h2>
        <p className="text-foreground-400">{anime.title}</p>
      </div>
    </div>
  );
}

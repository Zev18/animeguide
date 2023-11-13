import { Button, Image } from "@nextui-org/react";
import React from "react";

export default function AnimeResult({ anime }: { anime: Record<string, any> }) {
  return (
    <div className="flex min-h-max max-w-full items-center justify-between gap-2 p-4">
      <div className="flex max-w-full items-center gap-2">
        <Image
          alt={anime.title}
          src={anime.main_picture.medium}
          width={30}
          classNames={{ img: "rounded-lg" }}
          className="w-full min-w-full shrink-0 grow"
        />
        <p className="line-clamp-2 max-w-fit text-ellipsis text-sm">
          {anime.title}
        </p>
      </div>
      <Button variant="faded">Select</Button>
    </div>
  );
}

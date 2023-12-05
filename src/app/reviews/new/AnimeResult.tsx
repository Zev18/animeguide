import { Button, Image } from "@nextui-org/react";
import React from "react";
import { X } from "react-feather";

export default function AnimeResult({
  anime,
  callback,
  selectedAnimes,
}: {
  anime: Record<string, any>;
  callback: (anime: Record<string, any>) => void;
  selectedAnimes?: Record<string, any>[];
}) {
  const arrayIncludes = (
    arr: Record<string, any>[],
    obj: Record<string, any>,
  ): boolean => {
    const isObjectInArray = arr.some(
      (item) => JSON.stringify(item) === JSON.stringify(obj),
    );

    return !!isObjectInArray; // Convert the foundObject to a boolean
  };

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
      {selectedAnimes ? (
        <Button
          variant="faded"
          isIconOnly={arrayIncludes(selectedAnimes, anime)}
          onPress={() => callback(anime)}
        >
          {arrayIncludes(selectedAnimes, anime) ? <X size={16} /> : "Add"}
        </Button>
      ) : (
        <Button variant="faded" onPress={() => callback(anime)}>
          Select
        </Button>
      )}
    </div>
  );
}

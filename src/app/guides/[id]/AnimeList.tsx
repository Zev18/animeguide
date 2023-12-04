"use client";

import { anime } from "@/types/anime";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { capitalize } from "lodash";
import { useState } from "react";
import { ArrowUp } from "react-feather";
import AnimeCard from "./AnimeCard";

export default function AnimeList({ animes }: { animes: anime[] }) {
  const [sortBy, setSortBy] = useState("default");
  const [ascending, setAscending] = useState(true);
  const [animeList, setAnimeList] = useState(
    [...animes].sort((a, b) => a.order - b.order),
  );

  const sortArray = (value: string, asc: boolean) => {
    setSortBy(value);
    setAscending(asc);
    if (value.toLowerCase() == "date added") {
      const sorted = [...animeList].sort(
        (a: Record<string, any>, b: Record<string, any>) => {
          const date1 = new Date(a.dateAdded).getTime();
          const date2 = new Date(b.dateAdded).getTime();
          return asc ? date1 - date2 : date2 - date1;
        },
      );
      setAnimeList(sorted);
    } else {
      const sorted = [...animeList].sort(
        (a: Record<string, any>, b: Record<string, any>) => {
          return asc ? a.order - b.order : b.order - a.order;
        },
      );
      setAnimeList(sorted);
    }
  };

  return animeList.length == 0 ? (
    <div className="m-10 my-20 flex h-full w-full items-center justify-center text-foreground-400">
      This guide contains no animes... yet.
    </div>
  ) : (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-2 flex max-w-fit flex-col rounded-lg border-2 border-default-200 bg-default-100 p-2 px-4 text-sm">
        <div className="flex items-center gap-2 rounded-lg">
          <p>Sort by:</p>
          <ButtonGroup variant="flat" size="sm">
            <Dropdown>
              <DropdownTrigger>
                <Button>{capitalize(sortBy)}</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="list order"
                closeOnSelect
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) =>
                  sortArray(Array.from(keys)[0].toString(), ascending)
                }
              >
                <DropdownItem key="default">Default</DropdownItem>
                <DropdownItem key="date added">Date Added</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button isIconOnly onClick={() => sortArray(sortBy, !ascending)}>
              <ArrowUp
                size={16}
                className="duration-50 cursor-pointer transition-transform"
                style={ascending ? { transform: "rotate(180deg)" } : {}}
              />
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {animeList.map((anime: anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
}

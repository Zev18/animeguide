"use client";

import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Image as Picture } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { capitalize } from "lodash";
import React, { useState } from "react";
import cx from "classnames";
import { Button } from "@nextui-org/button";
import { ArrowDown, ArrowUp } from "react-feather";

export default function AnimeInfo({
  anime,
  avgScore,
}: {
  anime: Record<string, any>;
  avgScore: number | string | null;
}) {
  const [synopsisOpen, setSynopsisOpen] = useState(false);

  return (
    <>
      <Card isBlurred shadow="sm">
        <CardBody>
          <div className="grid grid-cols-3 gap-6 md:flex md:gap-12">
            <div className="max-w-xs overflow-hidden">
              <Picture
                as={Image}
                src={anime.main_picture.large}
                alt={anime.title}
                width={256}
                height={256}
                isBlurred
              />
            </div>
            <div className="col-span-2 flex grow flex-col gap-2">
              <h1 className="text-2xl font-bold text-primary md:text-3xl">
                {anime.title}
              </h1>
              <div className="flex flex-col items-baseline gap-1 sm:flex-row sm:gap-6">
                {avgScore != 0 && (
                  <div className="flex items-baseline gap-2">
                    <p className="text-foreground-400">Avg:</p>
                    <p className="text-lg">
                      <span className="text-primary">{avgScore}</span> / 10
                    </p>
                  </div>
                )}
                <Link
                  href={`https://myanimelist.net/anime/${anime.mal_id}`}
                  isExternal
                  showAnchorIcon
                  className="text-sm"
                >
                  MAL: {anime.mean ? anime.mean : "n/a"}
                </Link>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-foreground-400">Date:</p>
                <p>
                  {capitalize(anime.start_season.season) +
                    " " +
                    anime.start_season.year}
                </p>
              </div>
              <div className="m-2 hidden flex-col sm:flex">
                <h2 className="text-lg">Synopsis</h2>
                <p
                  className={cx("prose whitespace-pre-line", {
                    "line-clamp-5": !synopsisOpen,
                  })}
                >
                  {anime.synopsis}
                </p>
                <Button
                  onPress={() => setSynopsisOpen(!synopsisOpen)}
                  variant="light"
                  color="primary"
                >
                  {synopsisOpen ? (
                    <p className="flex items-center gap-2">
                      <ArrowUp />
                      Show Less
                    </p>
                  ) : (
                    <p className="flex items-center gap-2">
                      <ArrowDown />
                      Show More
                    </p>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="m-2 flex flex-col sm:hidden">
        <h2 className="text-lg">Synopsis</h2>
        <p
          className={cx("prose whitespace-pre-line", {
            "line-clamp-5": !synopsisOpen,
          })}
        >
          {anime.synopsis}
        </p>
        <Button
          onPress={() => setSynopsisOpen(!synopsisOpen)}
          variant="light"
          color="primary"
        >
          {synopsisOpen ? (
            <p className="flex items-center gap-2">
              <ArrowUp />
              Show Less
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <ArrowDown />
              Show More
            </p>
          )}
        </Button>
      </div>
    </>
  );
}

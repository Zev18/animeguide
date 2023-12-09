import React from "react";
import { anime } from "@/types/anime";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { BarChart2, Star } from "react-feather";
import Link from "next/link";

export default function AnimeCard({ anime }: { anime: anime }) {
  return (
    <Card>
      <CardBody>
        <div className="grid w-full grid-cols-5 items-center gap-2">
          <div className="flex items-center gap-4 md:col-span-3">
            <Image
              alt={anime.title}
              src={anime.mainPicture.medium}
              width={50}
            />
            <p className="hidden text-primary md:block">{anime.title}</p>
          </div>
          <Link
            href={`/anime/${anime.id}`}
            className="col-span-2 block text-primary md:hidden"
          >
            {anime.title}
          </Link>
          {anime.avgScore ? (
            <div className="flex flex-col justify-self-center">
              <p className="text-tiny italic text-foreground-500">Avg</p>
              <div className="flex items-center gap-1">
                <Star className="text-primary" size={14} />
                <p className="margin-0 text-lg">{anime.avgScore}</p>
              </div>
            </div>
          ) : (
            <div />
          )}
          <div className="flex flex-col justify-self-center">
            <p className="text-tiny italic text-foreground-500">Mal</p>
            <div className="flex items-center gap-1">
              <BarChart2 className="text-primary" size={16} />
              <p className="margin-0 text-lg">{anime.mean.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

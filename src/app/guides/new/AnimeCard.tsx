import React from "react";
import { anime } from "@/types/anime";
import { Card, CardBody, Image } from "@nextui-org/react";
import { BarChart2, Star } from "react-feather";

export default function AnimeCard({ anime }: { anime: Record<string, any> }) {
  return (
    <Card>
      <CardBody>
        <div className="grid w-full grid-cols-5 items-center gap-2">
          <div className="flex items-center gap-4 md:col-span-3">
            <Image
              alt={anime.title}
              src={anime.main_picture.medium}
              width={50}
            />
            <p className="hidden text-primary md:block">{anime.title}</p>
          </div>
          <p className="col-span-2 block text-primary md:hidden">
            {anime.title}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

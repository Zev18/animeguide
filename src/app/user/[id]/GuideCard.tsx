import React from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import { capitalize } from "lodash";
import { List, Bookmark } from "react-feather";
import Link from "next/link";

export default function GuideCard({ guide }: { guide: Record<string, any> }) {
  const iconSize = 13;

  return (
    <Card
      className="w-full max-w-xl p-2"
      isPressable
      as={Link}
      href={`/guides/${guide.id}`}
    >
      <CardBody className="p-4">
        <div className="flex w-full justify-between gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xl text-primary">{capitalize(guide.title)}</p>
            <p className="text-sm text-foreground-500">{guide.description}</p>
            <div className="flex items-center gap-4 text-tiny text-foreground-500">
              <div className="flex items-center gap-1">
                <List size={iconSize} />
                {guide.animeCount}
              </div>
              <div className="flex items-center gap-1">
                <Bookmark size={iconSize} />
                {guide.savedCount}
              </div>
            </div>
          </div>
          <div className="flex-end relative hidden max-h-full gap-2 sm:flex">
            {guide.animes &&
              guide.animes.map((anime: Record<string, any>, index: number) => (
                <Image
                  className="max-h-full object-contain"
                  width={60}
                  key={index}
                  alt={anime.title}
                  src={anime.mainPicture.medium}
                />
              ))}
            <div className="absolute bottom-0 z-10 flex h-full w-full justify-end bg-gradient-to-l from-transparent to-background"></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

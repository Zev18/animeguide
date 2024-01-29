import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import Link from "next/link";

export default function AnimeCard({ anime }: { anime: Record<string, any> }) {
  if (!anime) return;

  return (
    <Card
      as={Link}
      href={`/anime/${anime.node.id}`}
      isPressable
      className="max-h-min"
    >
      <CardHeader className="absolute top-1 z-20 flex-col !items-start lg:relative lg:flex-row lg:gap-4">
        <Image
          className="z-0 hidden h-full max-h-[10rem] w-min object-contain object-center shadow-lg lg:block"
          src={anime.node.main_picture.medium}
          alt={anime.node.title + " card background"}
          removeWrapper
        />
        <div className="flex shrink gap-2 lg:flex-col">
          <h4 className="text-left text-2xl font-bold text-white lg:font-normal lg:text-primary">
            {anime.node.title}
          </h4>
          {anime.node.mean && (
            <p className="mx-2 self-end text-right text-white lg:mx-0 lg:self-start lg:text-left lg:text-black">
              Mal average:{" "}
              <span className="text-lg font-bold lg:font-normal">
                {anime.node.mean}
              </span>
            </p>
          )}
        </div>
      </CardHeader>
      <div className="absolute z-10 h-full w-full bg-gradient-to-b from-black/50 to-transparent object-cover lg:hidden" />
      <Image
        className="z-0 h-full max-h-[10rem] w-full object-cover object-center sm:max-h-[15rem] lg:hidden"
        removeWrapper
        src={anime.node.main_picture.medium}
        alt={anime.node.title + " card background"}
      />
    </Card>
  );
}

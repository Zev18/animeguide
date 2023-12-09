import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { X } from "react-feather";

export default function AnimeCard({
  anime,
  callback,
}: {
  anime: Record<string, any>;
  callback?: (anime: Record<string, any>) => void;
}) {
  return (
    <Card>
      <CardBody>
        <div className="grid w-full grid-cols-4 items-center gap-2">
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
          {callback && (
            <X
              className="mr-4 justify-self-end text-danger"
              onClick={() => callback(anime)}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}

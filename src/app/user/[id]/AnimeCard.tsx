import { ListAnime } from "@/types/userAnimeList";
import { Card, CardFooter, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Image } from "@nextui-org/image";
import { capitalize } from "lodash";
import Link from "next/link";
import { CheckCircle, RefreshCw } from "react-feather";

export default function AnimeCard({ anime }: { anime: ListAnime }) {
  if (!anime) return;

  return (
    <Card
      as={Link}
      href={`/anime/${anime.node.id}`}
      isPressable
      className="max-h-min"
    >
      <CardHeader className="absolute top-1 z-20 flex-col !items-start">
        <h4 className="text-left text-2xl font-bold text-white">
          {anime.node.title}
        </h4>
        {anime.list_status.score != 0 && (
          <p className="mx-2 self-end text-right text-white">
            Mal score: {anime.list_status.score}
          </p>
        )}
      </CardHeader>
      <div className="absolute z-10 h-full w-full bg-gradient-to-b from-black/50 to-transparent object-cover" />
      <Image
        className="z-0 h-full max-h-[15rem] w-full object-cover object-center"
        removeWrapper
        src={anime.node.main_picture.medium}
        alt={anime.node.title + " card background"}
      />
      <CardFooter className="absolute bottom-0 gap-2">
        {anime.list_status.status === "completed" ? (
          <Chip
            color="success"
            startContent={
              <CheckCircle size={12} className="ml-1 text-success" />
            }
            variant="faded"
            className="border-success bg-black/50 backdrop-blur"
          >
            Completed
          </Chip>
        ) : (
          <Chip
            variant="dot"
            color={getChipColor(anime.list_status.status)}
            className="bg-white/50 backdrop-blur"
          >
            {capitalize(anime.list_status.status)}
          </Chip>
        )}
        {anime.list_status.is_rewatching && (
          <Chip
            color="success"
            startContent={
              <RefreshCw size={12} className="ml-1 text-slate-800" />
            }
            variant="faded"
            className="border-slate-500 bg-white/50 text-slate-800 backdrop-blur"
          >
            Rewatching
          </Chip>
        )}
      </CardFooter>
    </Card>
  );
}

const getChipColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "watching":
      return "success";
    case "on-hold":
      return "warning";
    case "dropped":
      return "danger";
    case "plan_to_watch":
      return "primary";
    default:
      return "primary";
  }
};

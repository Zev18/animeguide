import UserAnimeList from "@/types/userAnimeList";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { ArrowRight } from "react-feather";
import AnimeCard from "./AnimeCard";

export default function AnimeTab({
  animeList,
  username,
  malId,
}: {
  animeList?: UserAnimeList;
  username: string;
  malId: string;
}) {
  return (
    <div className="m-1 flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Recent Animes</h3>
        <Button
          as={Link}
          color="primary"
          variant="ghost"
          href={`https://myanimelist.net/animelist/${malId}`}
        >
          View all
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {animeList ? (
          animeList.data?.map((anime) => (
            <AnimeCard key={anime.node.id} anime={anime} />
          ))
        ) : (
          <div>No animes found.</div>
        )}
      </div>
      <Button
        color="primary"
        variant="light"
        className="my-2 self-center"
        as={Link}
        href={`https://myanimelist.net/animelist/${malId}`}
      >
        View more <ArrowRight size={16} />
      </Button>
    </div>
  );
}

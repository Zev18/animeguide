"use client";

import { userAtom } from "@/atoms";
import supabase from "@/utils/supabaseClient";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Image, Image as Picture } from "@nextui-org/image";
import { Link } from "@nextui-org/link";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import cx from "classnames";
import { useAtom } from "jotai";
import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Edit, Plus } from "react-feather";
import GuidesList from "./GuidesList";

type GuideMapRecord = {
  anime_id: number;
  guide_id: number;
  order: number;
};

export default function AnimeInfo({
  anime,
  avgScore,
}: {
  anime: Record<string, any>;
  avgScore: number | string | null;
}) {
  const iconSize = 16;
  const [synopsisOpen, setSynopsisOpen] = useState(false);
  const [user] = useAtom(userAtom);
  const [guides, setGuides] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    async function getGuides() {
      if (user) {
        const { data, error } = await supabase
          .from("anime_guides")
          .select("author_id, title, id, size, guides_anime_map(anime_id)")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false });
        if (error || !data) {
          console.log(error);
          return;
        }
        const alteredData = data.map((guide) => {
          let containsAnime = false;
          if (guide.guides_anime_map.some((obj) => obj.anime_id == anime.id)) {
            containsAnime = true;
          }
          return { ...guide, containsAnime };
        });
        setGuides(alteredData);
      }
    }
    getGuides();
  }, [user, anime.id]);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const router = useRouter();

  const addToGuides = async (guideIds: number[]) => {
    const newRecords: GuideMapRecord[] = [];
    const addedTo: number[] = [];
    guides.forEach((guide) => {
      if (guideIds.includes(guide.id)) {
        newRecords.push({
          guide_id: guide.id,
          anime_id: anime.id,
          order: guide.size + 1,
        });
        addedTo.push(guide.id);
        guide.containsAnime = true;
      }
    });

    await Promise.all([
      supabase.from("guides_anime_map").insert([...newRecords]),
      supabase.rpc("increment_size", { ids_to_update: addedTo }),
    ]);
    onClose();
  };

  return (
    <div className="flex flex-col items-center">
      <Card isBlurred shadow="sm" className="max-w-3xl p-2">
        <CardBody>
          <div className="grid grid-cols-3 gap-6 md:flex md:gap-12">
            <div className="flex flex-col gap-2 self-start">
              <div className="max-w-xs overflow-hidden">
                <Picture
                  as={Image}
                  src={anime.main_picture.large}
                  alt={anime.title}
                  width={256}
                  height={256}
                  isBlurred
                  className="mb-2"
                />
              </div>
              <Button
                className="hidden grow sm:flex"
                color="primary"
                variant="flat"
                startContent={<Edit size={iconSize} />}
                onPress={() => router.push(`/reviews/new?animeId=${anime.id}`)}
              >
                Write review
              </Button>
              <Button
                className="hidden grow sm:flex"
                color="primary"
                variant="flat"
                startContent={<Plus size={iconSize} />}
                onPress={
                  user
                    ? onOpen
                    : () => router.push("/login?redirect=/anime/" + anime.id)
                }
              >
                Add to guide
              </Button>
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
              <div className="flex items-baseline gap-2">
                <p className="text-foreground-400">Episodes:</p>
                <p>{anime.num_episodes}</p>
              </div>
              <div className="my-2 hidden flex-col gap-2 sm:flex">
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
        <CardFooter className="flex w-full gap-2 sm:hidden">
          <Button
            className="grow"
            color="primary"
            variant="flat"
            startContent={<Edit size={iconSize} />}
            onPress={() => router.push(`/reviews/new?animeId=${anime.id}`)}
          >
            Write review
          </Button>
          <Button
            className="grow"
            color="primary"
            variant="flat"
            startContent={<Plus size={iconSize} />}
            onPress={
              user
                ? onOpen
                : () => router.push("/login?redirect=/anime/" + anime.id)
            }
          >
            Add to guide
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
            <ModalContent>
              {(onClose) => (
                <GuidesList
                  guides={guides.filter(
                    (guide) => guide.containsAnime == false,
                  )}
                  animeId={anime.id}
                  callback={addToGuides}
                />
              )}
            </ModalContent>
          </Modal>
        </CardFooter>
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
    </div>
  );
}

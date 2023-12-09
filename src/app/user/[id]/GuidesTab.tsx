"use client";

import { userAtom } from "@/atoms";
import { Button } from "@nextui-org/button";
import { Link } from '@nextui-org/link'
import { Spinner } from "@nextui-org/spinner";
import { useAtom } from "jotai";
import GuideCard from "./GuideCard";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import supabase from "@/utils/supabaseClient";
import { camelize, getAnimeDetailsClient } from "@/utils/utils";

export default function GuidesTab({
  username,
  guides,
  count,
}: {
  username: string;
  guides: Record<string, any>[];
  count: number;
}) {
  const [user] = useAtom(userAtom);
  const [guidesList, setGuidesList] = useState(guides);

  const fetchNextGuides = async () => {
    const { data: newGuides, error } = await supabase
      .from("anime_guides")
      .select("*, users!inner(username), categories(category)")
      .eq("users.username", username)
      .range(guidesList.length, guidesList.length + 10);
    if (error) {
      console.log(error);
    } else {
      const guidePromises = newGuides.map(
        async (guide: Record<string, any>) => {
          guide["animes"] = [];
          const { data: animes } = await supabase
            .from("guides_anime_map")
            .select("anime_id")
            .order("order", { ascending: false })
            .eq("guide_id", guide.id)
            .limit(3);

          guide.animeCount = 0;

          if (animes) {
            const animePromises = animes.map(async (anime) => {
              const animeData = camelize(
                await getAnimeDetailsClient(anime.anime_id),
              );
              guide.animes.push(animeData);
            });

            const animeCountPromise = async () => {
              const { count } = await supabase
                .from("guides_anime_map")
                .select("anime_id", { count: "exact", head: true })
                .eq("guide_id", guide.id);
              guide.animeCount = count;
            };

            await Promise.all([...animePromises, animeCountPromise()]);
          }
        },
      );
      const countPromises = newGuides.map(
        async (guide: Record<string, any>) => {
          const { count, data } = await supabase
            .from("guides_users_map")
            .select("users!inner(username)", { count: "exact" })
            .eq("guide_id", guide.id);
          guide.savedCount = count;
          guide.savedUsers = data;
        },
      );

      await Promise.all([...guidePromises, ...countPromises]);
      setGuidesList([...guidesList, ...newGuides]);
    }
  };

  return (
    <div className="m-1 flex flex-col items-center gap-4">
      <style>
        {`
          .infinite-scroll-component__outerdiv {
            width: 100%;
            display: flex;
            justify-content: center;
          }
        `}
      </style>
      <div className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Anime guides</h3>
        {user && user.username === username && (
          <Button
            className="text-white"
            as={Link}
            color="primary"
            href={`/guides/new`}
            variant="shadow"
          >
            Create Guide
          </Button>
        )}
      </div>
      <InfiniteScroll
        next={fetchNextGuides}
        dataLength={guidesList.length}
        hasMore={count > guidesList.length}
        loader={
          <div className="my-2 flex w-full justify-center">
            <Spinner size="sm" />
          </div>
        }
        className="w-full px-8"
      >
        {guidesList.map((guide) => (
          <div key={guide.id} className="my-4 flex w-full justify-center">
            <GuideCard guide={guide} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

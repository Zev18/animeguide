import React from "react";
import { supabaseServerComponentClient } from "@/utils/supabaseServer";
import { notFound } from "next/navigation";
import { camelize, getAnimeDetails } from "@/utils/utils";
import { Avatar, Image } from "@nextui-org/react";
import Link from "next/link";
import { format } from "date-fns";
import { Clock } from "react-feather";

export default async function Guide({ params }: { params: { id: string } }) {
  const supabase = await supabaseServerComponentClient();

  const { data: guide } = camelize(
    await supabase
      .from("anime_guides")
      .select("*, users!inner(*)")
      .eq("id", params.id)
      .single(),
  );

  const { data: animes } = camelize(
    await supabase
      .from("guides_anime_map")
      .select("anime_id, order")
      .eq("guide_id", params.id),
  );

  if (animes) {
    const animeList: Record<string, any>[] = [];
    const animePromises = animes.map(async (anime: Record<string, number>) => {
      const animeData = camelize(await getAnimeDetails(anime.animeId));
      animeList.push({ ...animeData, order: anime.order });
    });

    await Promise.all([...animePromises]);
    guide.animeList = animeList;
  }

  const { data: users, count: userCount } = camelize(
    await supabase
      .from("guides_users_map")
      .select("*, users!inner(username, avatar_url, display_name)")
      .eq("guide_id", params.id),
  );

  console.log(guide);
  console.log(guide.animeList);
  console.log(users);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{guide.title}</h1>
          <p className="text-foreground-400">{guide.description}</p>
        </div>
        <div className="flex items-center gap-2 md:flex-row-reverse">
          <Avatar
            alt={guide.users.displayName}
            src={guide.users.avatarUrl}
            name={guide.users.displayName}
          />
          <div className="flex flex-col justify-center text-foreground-400 md:items-end">
            <p>
              Created by{" "}
              <Link
                className="text-primary"
                href={`/user/${guide.users.username}`}
              >
                {guide.users.displayName}
              </Link>{" "}
              on {format(new Date(guide.createdAt), "MM/dd/yyyy")}
            </p>
            {guide.createdAt != guide.updatedAt && (
              <p className="flex items-center gap-2">
                <Clock size={20} /> Last edited on{" "}
                {format(new Date(guide.updatedAt), "MM/dd/yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

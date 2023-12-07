import CopyLink from "@/components/CopyLink";
import { supabaseServerComponentClient } from "@/utils/supabaseServer";
import { camelize, getAnimeDetails } from "@/utils/utils";
import { Avatar, Chip } from "@nextui-org/react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { format } from "date-fns";
import { cookies } from "next/headers";
import Link from "next/link";
import { Bookmark, Clock, Eye, List } from "react-feather";
import { Database } from "../../../../database.types";
import AnimeList from "./AnimeList";
import GuideActions from "./GuideActions";
import ViewsTracker from "./ViewsTracker";
import { notFound } from "next/navigation";

export default async function Guide({ params }: { params: { id: string } }) {
  const supabase = await supabaseServerComponentClient<Database>();

  const { data: guide, error } = camelize(
    await supabase
      .from("anime_guides")
      .select("*, users!inner(*), categories(category)")
      .eq("id", params.id)
      .single(),
  );

  if (error) {
    console.log(error);
    return notFound();
  }

  const { data: animes } = camelize(
    await supabase
      .from("guides_anime_map")
      .select("anime_id, order, date_added")
      .eq("guide_id", params.id)
      .order("order"),
  );

  if (animes) {
    const animeList: Record<string, any>[] = [];
    const animePromises = animes.map(async (anime: Record<string, number>) => {
      const animeData = camelize(await getAnimeDetails(anime.animeId, "mean"));
      const { data: avgScore } = await supabase.rpc("average_score", {
        p_anime_id: anime.animeId,
      });
      animeList.push({
        ...animeData,
        avgScore: avgScore,
        order: anime.order,
        dateAdded: anime.dateAdded,
      });
    });

    await Promise.all([...animePromises]);
    guide.animeList = animeList;
    guide.animeCount = animeList.length;
  }

  const { data: users, count: userCount } = camelize(
    await supabase
      .from("guides_users_map")
      .select("*, users!inner(username, avatar_url, display_name)", {
        count: "estimated",
      })
      .eq("guide_id", params.id),
  );

  guide.userCount = userCount || 0;

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <div className="w-full">
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="items-center text-2xl font-bold">
                  {guide.title}
                </h1>
                {guide.categories && (
                  <Link href={`/categories/${guide.categories.category}`}>
                    <Chip size="sm" variant="flat" color="primary">
                      {guide.categories.category}
                    </Chip>
                  </Link>
                )}
                <CopyLink />
              </div>
              <ViewsTracker guideId={guide.id} />
            </div>
            <div className="flex items-center gap-4 md:flex-row-reverse">
              <Avatar
                alt={guide.users.displayName}
                src={guide.users.avatarUrl}
                name={guide.users.displayName}
              />
              <div className="flex flex-col justify-center text-sm text-foreground-400 md:items-end">
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
          <p className="my-2 text-foreground-400">{guide.description}</p>
          <div className="flex w-full justify-between">
            <div className="my-2 flex gap-4">
              <div className="flex items-center gap-2 text-foreground-500">
                <List size={16} />
                <p>{guide.animeCount}</p>
              </div>
              <div className="flex items-center gap-2 text-foreground-500">
                <Eye size={16} />
                <p>{guide.views}</p>
              </div>
              <div className="flex items-center gap-2 text-foreground-500">
                <Bookmark size={16} />
                <p>{guide.userCount}</p>
              </div>
            </div>
            <GuideActions guideInfo={guide} />
          </div>
        </div>
        <AnimeList animes={guide.animeList} />
      </div>
    </div>
  );
}

import { supabaseServerComponentClient } from "@/utils/supabaseServer";
import { camelize, getAnimeDetails } from "@/utils/utils";
import { Avatar, Button } from "@nextui-org/react";
import { format } from "date-fns";
import Link from "next/link";
import { Bookmark, Clock, Eye, List } from "react-feather";
import AnimeList from "./AnimeList";
import GuideActions from "./GuideActions";
import { Database } from "../../../../database.types";
import ViewsTracker from "./ViewsTracker";

export default async function Guide({ params }: { params: { id: string } }) {
  const supabase = await supabaseServerComponentClient<Database>();

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
      .select("anime_id, order, date_added")
      .eq("guide_id", params.id),
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

  // const { error } = await supabase.rpc("increment_views", {
  //   guide_id: guide.id,
  // });
  // if (error) console.log(error);

  console.log(guide);
  console.log(guide.animeList);
  console.log(users);
  console.log(userCount);

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <div className="w-full">
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{guide.title}</h1>
              <p className="text-foreground-400">{guide.description}</p>
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

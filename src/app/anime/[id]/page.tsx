import supabase from "@/utils/supabaseClient";
import { getAnimeDetails } from "@/utils/utils";
import AnimeInfo from "./AnimeInfo";
import ReviewsSection from "./ReviewsSection";
import NotFound from "./not-found";
import GuidesSection from "./GuidesSection";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const [
    anime,
    { data: reviews, count: reviewsCount },
    { data: avgScore },
    { data: guides },
    { count: guidesCount },
  ] = await Promise.all([
    getAnimeDetails(
      Number(params.id),
      "synopsis,mean,status,num_episodes,studios,related_anime,start_season,alternative_titles",
    ),
    supabase
      .from("reviews")
      .select(
        "*, users!inner(username, avatar_url, display_name), detailed_score(*)",
        {
          count: "exact",
        },
      )
      .eq("anime_id", params.id)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.rpc("average_score", {
      p_anime_id: Number(params.id),
    }),
    supabase.rpc("get_guides_with_anime", {
      anime_id_param: Number(params.id),
    }),
    supabase
      .from("anime_guides")
      .select("id, guides_anime_map!inner(anime_id)", {
        count: "estimated",
        head: true,
      })
      .eq("guides_anime_map.anime_id", params.id)
      .limit(6)
      .order("views", { ascending: false }),
  ]);

  if (anime instanceof Error) return <NotFound />;

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8">
      <AnimeInfo anime={anime} avgScore={Number(avgScore).toFixed(1)} />
      <div className="grid grid-cols-1 gap-4 lg:max-w-6xl lg:grid-cols-5 lg:gap-8">
        <div className="col-span-3 flex justify-center">
          <ReviewsSection
            reviews={reviews}
            animeId={anime.id}
            count={reviewsCount}
          />
        </div>
        <div className="col-span-2">
          <GuidesSection guides={guides} count={guidesCount} />
        </div>
      </div>
    </div>
  );
}

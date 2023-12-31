import supabase from "@/utils/supabaseClient";
import { getAnimeDetails } from "@/utils/utils";
import React from "react";
import NotFound from "./not-found";
import AnimeInfo from "./AnimeInfo";
import ReviewsSection from "./ReviewsSection";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const [anime, { data: reviews, count: reviewsCount }, { data: avgScore }] =
    await Promise.all([
      getAnimeDetails(
        Number(params.id),
        "synopsis,mean,status,num_episodes,studios,related_anime,start_season,alternative_titles",
      ),
      supabase
        .from("reviews")
        .select("*", { count: "exact" })
        .eq("anime_id", params.id),
      supabase.rpc("average_score", {
        p_anime_id: Number(params.id),
      }),
    ]);

  console.log(anime);
  console.log(reviews);

  if (anime instanceof Error) return <NotFound />;

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <AnimeInfo anime={anime} avgScore={Number(avgScore).toFixed(1)} />
      <ReviewsSection reviews={reviews} count={reviewsCount} />
    </div>
  );
}

import supabase from "@/utils/supabaseClient";
import { getAnimeDetails } from "@/utils/utils";
import React from "react";
import NotFound from "./not-found";

export default async function AnimePage({
  params,
}: {
  params: { id: string };
}) {
  const anime = await getAnimeDetails(Number(params.id));

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("anime_id", params.id);

  console.log(anime);
  console.log(reviews);

  if (anime instanceof Error) return <NotFound />;

  return <div>Page</div>;
}

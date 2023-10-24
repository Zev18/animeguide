import supabaseServerComponentClient from "@/utils/supabaseServer";
import { camelize, getAnimeDetails, getMalList } from "@/utils/utils";
import { notFound } from "next/navigation";
import ProfileData from "./ProfileData";
import UserTabs from "./UserTabs";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await supabaseServerComponentClient();

  const { data: userData } = camelize(
    await supabase.from("users").select().eq("username", params.id).single(),
  );

  const { data: reviews } = camelize(
    await supabase
      .from("reviews")
      .select("*, users!inner(username), detailed_score(*)")
      .eq("users.username", params.id)
      .limit(10),
  );

  const { data: guides } = camelize(
    await supabase
      .from("anime_guides")
      .select("*, users!inner(username), categories(category)")
      .eq("users.username", params.id)
      .limit(10),
  );

  if (guides) {
    const guidePromises = guides.map(async (guide: Record<string, any>) => {
      guide["animes"] = [];
      const { data: animes } = await supabase
        .from("guides_anime_map")
        .select("anime_id")
        .order("order", { ascending: false })
        .eq("guide_id", guide.id)
        .limit(3);
      if (animes) {
        const animePromises = animes.map(async (anime) => {
          const animeData = await getAnimeDetails(anime.anime_id);
          guide.animes.push(animeData);
        });
        await Promise.all(animePromises);
      }
    });

    await Promise.all(guidePromises);
  }

  if (reviews) {
    for (const review of reviews) {
      const anime = await getAnimeDetails(review.animeId);
      review["anime"] = camelize(anime);
    }
  }

  const animeList =
    userData && userData.malId
      ? await getMalList(userData.malId, 10, ...[, ,], "list_updated_at")
      : null;

  if (!userData) return notFound();

  return (
    <div className="flex flex-col gap-8">
      <ProfileData username={params.id} fetchedData={userData} />
      <UserTabs
        reviews={reviews}
        animeList={animeList}
        className="flex w-full flex-col"
        userInfo={userData}
        guides={guides}
      />
    </div>
  );
}

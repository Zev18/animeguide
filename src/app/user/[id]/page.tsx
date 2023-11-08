import { supabaseServerComponentClient } from "@/utils/supabaseServer";
import supabaseServer from "@/utils/supabaseServer";
import { camelize, getAnimeDetails, getMalList } from "@/utils/utils";
import { notFound } from "next/navigation";
import ProfileData from "./ProfileData";
import UserTabs from "./UserTabs";

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = await supabaseServer;
  const { data: users } = await supabase
    .from("users")
    .select("username")
    .not("username", "is", null);

  return users!.map((user) => ({
    id: user.username,
  }));
}

export default async function Page({ params }: { params?: { id: string } }) {
  const supabase = await supabaseServerComponentClient();
  const username = params ? params.id : "";

  const { data: userData } = camelize(
    await supabase.from("users").select().eq("username", username).single(),
  );

  const { data: reviews } = camelize(
    await supabase
      .from("reviews")
      .select("*, users!inner(username), detailed_score(*)")
      .eq("users.username", username)
      .limit(10),
  );

  const { data: guides } = camelize(
    await supabase
      .from("anime_guides")
      .select("*, users!inner(username), categories(category)")
      .eq("users.username", username)
      .limit(10),
  );

  // fetch guide anime info and info on who saved the guide
  if (guides) {
    const guidePromises = guides.map(async (guide: Record<string, any>) => {
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
          const animeData = camelize(await getAnimeDetails(anime.anime_id));
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
    });

    const countPromises = guides.map(async (guide: Record<string, any>) => {
      const { count, data } = await supabase
        .from("guides_users_map")
        .select("users!inner(username)", { count: "exact" })
        .eq("guide_id", guide.id);
      guide.savedCount = count;
      guide.savedUsers = data;
    });

    await Promise.all([...guidePromises, ...countPromises]);
  }

  if (reviews) {
    for (const review of reviews) {
      const anime = camelize(await getAnimeDetails(review.animeId));
      review["anime"] = anime;
    }
  }

  const animeList =
    userData && userData.malId
      ? await getMalList(userData.malId, 10, ...[, ,], "list_updated_at")
      : null;

  if (!userData) return notFound();

  return (
    <div className="flex flex-col gap-8">
      <ProfileData username={username} fetchedData={userData} />
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

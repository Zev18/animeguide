import { supabaseServerComponentClient } from "@/utils/supabaseServer";
import { camelize, getAnimeDetails, getMalList } from "@/utils/utils";
import { notFound } from "next/navigation";
import ProfileData from "./ProfileData";
import UserTabs from "./UserTabs";

export default async function Page({ params }: { params?: { id: string } }) {
  const supabase = await supabaseServerComponentClient();
  const username = params ? params.id : "";

  const userPromise = supabase
    .from("users")
    .select()
    .eq("username", username)
    .single()
    .then((response) => camelize(response));

  const reviewsPromise = supabase
    .from("reviews")
    .select("*, users!inner(username), detailed_score(*)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .eq("users.username", username)
    .limit(10)
    .then((response) => camelize(response));

  const guidesPromise = supabase
    .from("anime_guides")
    .select("*, users!inner(username), categories(category)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .eq("users.username", username)
    .limit(10)
    .then((response) => camelize(response));

  const [userData, reviewsData, guidesData] = await Promise.all([
    userPromise,
    reviewsPromise,
    guidesPromise,
  ]);

  const promises = [];

  if (guidesData.data) {
    const guidePromises = guidesData.data.map(
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
          await animes.map(async (anime) => {
            const animeData = camelize(await getAnimeDetails(anime.anime_id));
            guide.animes.push(animeData);
          });
        }
      },
    );

    const countPromises = guidesData.data.map(
      async (guide: Record<string, any>) => {
        const { count, data } = await supabase
          .from("guides_users_map")
          .select("users!inner(username)", { count: "exact" })
          .eq("guide_id", guide.id);
        guide.savedCount = count;
        guide.savedUsers = data;
      },
    );

    promises.push([...guidePromises], [...countPromises]);
  }

  if (reviewsData.data) {
    const reviewPromises = reviewsData.data.map(
      async (review: Record<string, any>) => {
        const anime = camelize(await getAnimeDetails(review.animeId));
        review["anime"] = anime;
      },
    );

    promises.push([...reviewPromises]);
  }

  await Promise.all(promises);

  const animeList =
    userData.data && userData.data.malId
      ? await getMalList(userData.data.malId, 10, ...[, ,], "list_updated_at")
      : null;

  if (!userData) return notFound();

  console.log(guidesData.data);

  return (
    <div className="flex flex-col gap-8">
      <ProfileData username={username} fetchedData={userData.data} />
      <UserTabs
        metadata={{
          reviewCount: reviewsData.count,
          guideCount: guidesData.count,
        }}
        reviews={reviewsData.data}
        animeList={animeList}
        className="flex w-full flex-col"
        userInfo={userData.data}
        guides={guidesData.data}
      />
    </div>
  );
}

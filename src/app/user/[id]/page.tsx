import supabaseServerComponentClient from "@/utils/supabaseServer";
import { camelize, getMalList } from "@/utils/utils";
import { notFound } from "next/navigation";
import ProfileData from "./ProfileData";
import UserTabs from "./UserTabs";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await supabaseServerComponentClient();

  const { data: userData } = camelize(
    await supabase.from("users").select().eq("username", params.id).single(),
  );

  const animeList =
    userData && userData.malId
      ? await getMalList(userData.malId, 10, ...[, ,], "list_updated_at")
      : null;

  if (!userData) return notFound();

  return (
    <div className="flex flex-col gap-8">
      <ProfileData username={params.id} fetchedData={userData} />
      <UserTabs
        animeList={animeList}
        className="flex w-full flex-col"
        userInfo={userData}
      />
    </div>
  );
}

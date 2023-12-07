import { supabaseServerComponentClient } from "@/utils/supabaseServer";
import { Database } from "../../../../../database.types";
import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import GuideForm from "../../new/guideForm";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await supabaseServerComponentClient<Database>();

  const { data: guide } = await supabase
    .from("anime_guides")
    .select("*")
    .eq("id", params.id)
    .single();

  const { data: animes } = await supabase
    .from("guides_anime_map")
    .select("*")
    .eq("guide_id", params.id)
    .order("order");

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", guide.category)
    .maybeSingle();

  guide.animes = animes;
  guide.category = category ? category : null;

  return (
    <div className="mx-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Edit Guide</h1>
      </div>
      <Suspense
        fallback={
          <div className="flex w-full justify-center">
            <Spinner />
          </div>
        }
      >
        <GuideForm guideInfo={guide} />
      </Suspense>
    </div>
  );
}

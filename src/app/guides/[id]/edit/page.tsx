import { Spinner } from "@nextui-org/spinner";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import GuideForm from "../../new/guideForm";

export default async function Page({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/login?redirect=/guides/edit");
  }

  const { data: guide, error } = await supabase
    .from("anime_guides")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    console.log(error);
    return notFound();
  }
  if (session.user.id != guide.author_id) {
    redirect("/");
  }

  const { data: animes } = await supabase
    .from("guides_anime_map")
    .select("*")
    .eq("guide_id", params.id)
    .order("order");

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("id", guide.category_id)
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

import { Spinner } from "@nextui-org/react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Database } from "../../../../database.types";
import GuideForm from "./guideForm";

export default async function NewGuide() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/login");
  }

  return (
    <div className="mx-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">New Guide</h1>
        <p className="text-foreground-400">
          Create a new guide to easily share your recommendations with your
          friends.
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex w-full justify-center">
            <Spinner />
          </div>
        }
      >
        <GuideForm />
      </Suspense>
    </div>
  );
}

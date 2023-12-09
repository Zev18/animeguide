import { Spinner } from "@nextui-org/spinner";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Database } from "../../../../database.types";
import ReviewForm from "./reviewForm";

export default async function NewReview() {
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
        <h1 className="text-2xl font-bold">New Review</h1>
        <p className="text-foreground-400">
          All you need is either a short comment or a rating from 1-10, but you
          can add anything else you want!
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex w-full justify-center">
            <Spinner />
          </div>
        }
      >
        <ReviewForm />
      </Suspense>
    </div>
  );
}

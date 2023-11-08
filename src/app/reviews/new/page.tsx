import { Spinner } from "@nextui-org/react";
import { Suspense } from "react";
import ReviewForm from "./reviewForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../database.types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    redirect("/");
  }

  return (
    <div className="mx-2">
      <h1 className="text-2xl font-bold">New Review</h1>
      <Suspense fallback={<Spinner />}>
        <ReviewForm />
      </Suspense>
    </div>
  );
}

"use client";

import JustLogin from "@/components/JustLogin";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();
  const redirect = params.get("redirect");

  return (
    <div className="my-10 flex w-full justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="my-2 text-2xl font-bold">
          Aren&apos;t you forgetting something?
        </h1>
        <p>Please log in or create an account first.</p>
        <JustLogin />
      </div>
    </div>
  );
}

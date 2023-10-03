"use client";

import { userAtom } from "@/atoms";
import { useAtom } from "jotai";

export default function Home() {
  const [user] = useAtom(userAtom);

  return (
    <main className="flex h-full flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Anime Guide</h1>
      <pre className="max-w-2xl whitespace-break-spaces">
        {user ? "Loaded!" : "Loading........."}
      </pre>
    </main>
  );
}

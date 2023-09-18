"use client";

import { useAtom } from "jotai";
import { userAtom } from "@/atoms";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);

  return (
    <main className="flex h-full flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold">Anime Guide</h1>
      <pre className="max-w-2xl whitespace-break-spaces">
        {JSON.stringify(user, null, 2)}
      </pre>
    </main>
  );
}

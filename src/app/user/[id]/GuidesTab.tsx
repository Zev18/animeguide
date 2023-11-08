"use client";

import { userAtom } from "@/atoms";
import { Button, Link } from "@nextui-org/react";
import { useAtom } from "jotai";
import GuideCard from "./GuideCard";

export default function GuidesTab({
  username,
  guides,
}: {
  username: string;
  guides: Record<string, any>[];
}) {
  const [user] = useAtom(userAtom);

  return (
    <div className="m-1 flex flex-col items-center gap-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Anime guides</h3>
        {user && user.username === username && (
          <Button
            className="text-white"
            as={Link}
            color="primary"
            href={`/guides/new`}
            variant="shadow"
          >
            Create Guide
          </Button>
        )}
      </div>
      {guides.map((guide) => (
        <GuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
}

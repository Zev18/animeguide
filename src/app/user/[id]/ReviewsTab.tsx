"use client";

import { userAtom } from "@/atoms";
import { Button } from "@nextui-org/react";
import { useAtom } from "jotai";
import Link from "next/link";

export default function ReviewsTab({ username }: { username: string }) {
  const [user] = useAtom(userAtom);

  return (
    <div className="m-1 flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-2xl font-bold">Reviews</h3>
        {user && user.username === username && (
          <Button
            className="text-white"
            as={Link}
            color="primary"
            href={`/reviews/new`}
            variant="shadow"
          >
            New Review
          </Button>
        )}
      </div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
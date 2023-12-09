"use client";

import { userAtom } from "@/atoms";
import { Button } from "@nextui-org/button";
import { useAtom } from "jotai";
import Link from "next/link";
import ReviewCard from "./ReviewCard";

export default function ReviewsTab({
  username,
  reviews,
  count,
}: {
  username: string;
  reviews: any[];
  count: number;
}) {
  const [user] = useAtom(userAtom);

  return (
    <div className="m-1 flex flex-col items-center gap-4">
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
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

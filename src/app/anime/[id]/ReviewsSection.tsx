import { camelize } from "@/utils/utils";
import ReviewCard from "./ReviewCard";
import React from "react";
import { Button } from "@nextui-org/button";

export default function ReviewsSection({
  reviews,
  count = 0,
}: {
  reviews: Record<string, any>[] | null;
  count: number | null;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Reviews</h2>
          <p className="text-lg text-foreground-400">({count})</p>
        </div>
        <Button color="primary" variant="flat">
          View all
        </Button>
      </div>
      <div className="my-4 flex w-full flex-col items-center gap-2">
        {reviews ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={camelize(review)} />
          ))
        ) : (
          <p className="text-lg text-foreground-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

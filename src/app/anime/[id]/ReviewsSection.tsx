import React from "react";

export default function ReviewsSection({
  reviews,
  count = 0,
}: {
  reviews: Record<string, any>[] | null;
  count: number | null;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Reviews</h2>
    </div>
  );
}

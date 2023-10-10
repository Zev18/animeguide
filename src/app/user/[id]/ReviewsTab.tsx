"use client";

import { userAtom } from "@/atoms";
import RadarChart from "@/components/RadarChart";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useAtom } from "jotai";
import Link from "next/link";

export default function ReviewsTab({
  username,
  reviews,
}: {
  username: string;
  reviews: any[];
}) {
  const [user] = useAtom(userAtom);

  console.log(reviews);

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
      {reviews.map((review) => (
        <Card className="p-2" key={review.id}>
          <CardHeader className="flex w-full items-center">
            <h4 className="text-lg font-semibold">{review.comment}</h4>
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="rounded-lg bg-primary p-2 py-1 font-bold tracking-wide text-background">
                {review.overallScore}
                <span className="font-normal opacity-70">{" / 10"}</span>
              </p>
              <RadarChart data={review.detailedScore} />
            </div>
          </CardHeader>
          <CardBody>
            <p>{review.longReview}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

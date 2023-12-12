"use client";

import { userAtom } from "@/atoms";
import supabase from "@/utils/supabaseClient";
import { camelize, getAnimeDetailsClient } from "@/utils/utils";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";
import { useAtom } from "jotai";
import Link from "next/link";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const [reviewsList, setReviewsList] = useState(reviews);

  const fetchNextReviews = async () => {
    const { data: newReviews, error } = camelize(
      await supabase
        .from("reviews")
        .select("*, users!inner(username), detailed_score(*)")
        .order("created_at", { ascending: false })
        .eq("users.username", username)
        .range(reviewsList.length, reviewsList.length + 10),
    );
    if (error) {
      console.log(error);
    } else {
      const reviewPromises = newReviews.map(
        async (review: Record<string, any>) => {
          const anime = camelize(await getAnimeDetailsClient(review.animeId));
          review["anime"] = anime;
        },
      );

      await Promise.all(reviewPromises);
      setReviewsList([...reviewsList, ...newReviews]);
    }
  };

  return (
    <div className="m-1 flex flex-col items-center gap-4">
      <style>
        {`
          .infinite-scroll-component__outerdiv {
            width: 100%;
            display: flex;
            justify-content: center;
          }
        `}
      </style>
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
      <InfiniteScroll
        next={fetchNextReviews}
        dataLength={reviewsList.length}
        hasMore={count > reviewsList.length}
        loader={
          <div className="my-2 flex w-full justify-center">
            <Spinner size="sm" />
          </div>
        }
        className="w-full px-8"
      >
        {reviewsList.map((review) => (
          <div key={review.id} className="my-4 flex w-full justify-center">
            <ReviewCard review={review} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

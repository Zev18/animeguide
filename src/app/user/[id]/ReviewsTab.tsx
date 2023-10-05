"use client";

import { userAtom } from "@/atoms";
import RadarChart from "@/components/RadarChart";
import supabase from "@/utils/supabaseClient";
import { Button } from "@nextui-org/react";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReviewsTab({ username }: { username: string }) {
  const [user] = useAtom(userAtom);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*, users!inner(username), detailed_score(*)")
          .eq("users.username", username);

        setReviews(data!);
      } catch (error) {
        console.log(error);
      }
    };

    getReviews();
  }, [username]);

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
      {reviews[0] && <RadarChart data={reviews[0]?.detailed_score} />}
    </div>
  );
}

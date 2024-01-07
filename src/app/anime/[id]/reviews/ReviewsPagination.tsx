"use client";

import supabase from "@/utils/supabaseClient";
import { camelize, getPagination } from "@/utils/utils";
import { Pagination } from "@nextui-org/pagination";
import { parseAsInteger, useQueryState } from "next-usequerystate";
import React, { useEffect, useState } from "react";
import ReviewCard from "../ReviewCard";

export default function ReviewsPagination({ animeId }: { animeId: number }) {
  const pageSize = 10;
  const [page, setPage] = useQueryState("page", parseAsInteger);
  const { from, to } = getPagination(page, pageSize);
  const [reviews, setReviews] = useState<Record<string, any>>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, count } = camelize(
        await supabase
          .from("reviews")
          .select(
            "*, users!inner(username, avatar_url, display_name), detailed_score(*)",
            { count: "exact" },
          )
          .eq("anime_id", animeId)
          .order("created_at", { ascending: false })
          .range(from, to),
      );
      data ? setReviews(data) : setReviews([]);
      count ? setTotalPages(Math.ceil(count / pageSize)) : setTotalPages(1);
    };

    fetchReviews();
  }, [animeId, from, to]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="my-4 flex flex-col items-center gap-2">
        {reviews.map((review: Record<string, any>) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <Pagination
        total={totalPages}
        page={page ? page : 1}
        onChange={setPage}
        showControls
      />
    </div>
  );
}

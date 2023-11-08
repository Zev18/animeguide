"use client";
import { userAtom } from "@/atoms";
import supabase from "@/utils/supabaseClient";
import { camelize } from "@/utils/utils";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ReviewForm({ reviewId }: { reviewId?: number }) {
  const [user] = useAtom(userAtom);

  const params = useParams();
  const [formData, setFormData] = useState({
    authorId: user?.id || "",
    animeId: params.animeId || "",
    comment: "",
    longReview: "",
    overallScore: "",
    detailedScore: [],
    longReviewPreview: "",
    isDraft: false,
  });

  useEffect(() => {
    if (reviewId) {
      // Fetch review data from the "reviews" table using Supabase API
      const fetchReviewData = async () => {
        const { data, error } = await camelize(
          supabase.from("reviews").select("*").eq("id", reviewId).single(),
        );

        if (error) {
          console.error("Error fetching review data:", error);
        } else {
          // Prepopulate the form with data from the review
          setFormData({
            authorId: data.authorId,
            animeId: data.animeId,
            comment: data.comment,
            longReview: data.longReview,
            overallScore: data.overallScore,
            detailedScore: data.detailedScore,
            longReviewPreview: data.longReviewPreview,
            isDraft: data.isDraft,
          });
        }
      };

      fetchReviewData();
    }
  }, [reviewId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, you can send the formData to the server or perform other actions here.
  };
  return <form onSubmit={handleFormSubmit}></form>;
}

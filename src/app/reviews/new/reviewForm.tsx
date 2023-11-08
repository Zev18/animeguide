"use client";
import { userAtom } from "@/atoms";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useState } from "react";

export default function ReviewForm() {
  const [user] = useAtom(userAtom);

  const params = useParams();
  const [animeId, setAnimeId] = useState(params.anime || "");
  const [comment, setComment] = useState("");
  const authorId = user?.id;

  return <form></form>;
}

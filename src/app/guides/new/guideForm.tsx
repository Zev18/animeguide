"use client";

import { userAtom } from "@/atoms";
import { Input, Textarea } from "@nextui-org/react";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { z } from "zod";
import AddAnime from "./AddAnime";
import EditableAnimeList from "./EditableAnimeList";

type guideInfo = {
  authorId: number;
  categoryId: number | null;
  title: string;
  description: string | null;
  animes: number[];
};

export default function GuideForm({ guideInfo }: { guideInfo?: guideInfo }) {
  const [user] = useAtom(userAtom);

  const schema = z.object({
    authorId: z.string({ required_error: "Author ID is required." }),
    categoryId: z.number().nullable(),
    title: z.string().max(100, "Title is too long."),
    description: z.string().max(250, "Description is too long.").nullable(),
  });

  const [formData, setFormData] = useState({
    authorId: user?.id,
    categoryId: null,
    title: "",
    description: "",
  });

  const [animes, setAnimes] = useState<Record<string, any>[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onAnimesSelect = (animes: Record<string, any>[]) => {
    setAnimes(animes);
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 flex justify-center sm:m-4">
      <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <Input
            size="lg"
            labelPlacement="outside"
            isRequired
            value={formData.title}
            variant="bordered"
            label="Title"
            maxLength={100}
            onValueChange={(text) => setFormData({ ...formData, title: text })}
          />
          <Textarea
            label="Description"
            variant="faded"
            maxLength={250}
            onValueChange={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
        </div>
        <div className="flex w-full justify-between">
          <AddAnime animes={animes} callback={onAnimesSelect} />
        </div>
        <EditableAnimeList animes={animes} callback={onAnimesSelect} />
      </div>
    </form>
  );
}

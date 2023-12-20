"use client";

import { userAtom } from "@/atoms";
import supabase from "@/utils/supabaseClient";
import { formatDatePg, getAnimeDetailsClient } from "@/utils/utils";
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import AddAnime from "./AddAnime";
import CategorySelect from "./CategorySelect";
import EditableAnimeList from "./EditableAnimeList";
import { revalidatePath } from "next/cache";

type guideInfo = {
  id: number;
  authorId: number;
  category: Record<string, any> | null;
  title: string;
  description: string | null;
  animes: Record<string, any>[];
};

type animeSubmission = {
  id?: number;
  anime_id: number;
  guide_id: number;
  date_added: string;
  order: number;
};

export default function GuideForm({ guideInfo }: { guideInfo?: guideInfo }) {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  const schema = z.object({
    authorId: z.string({ required_error: "Author ID is required." }),
    category: z.number().nullable(),
    title: z
      .string()
      .max(100, "Title is too long.")
      .min(1, "Title is required."),
    description: z.string().max(250, "Description is too long.").nullable(),
    updatedAt: z.string().optional(),
  });

  type schemaType = z.infer<typeof schema>;

  const [formData, setFormData] = useState<schemaType>({
    authorId: user!.id,
    category: guideInfo?.category ? guideInfo.category.id : null,
    title: guideInfo?.title || "",
    description: guideInfo?.description || "",
  });
  const [animes, setAnimes] = useState<Record<string, any>[]>([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchAnimes = async () => {
      const animeList: Record<string, any>[] = [];
      const animePromises = guideInfo!.animes.map(
        async (anime: Record<string, number>) => {
          const animeData = await getAnimeDetailsClient(anime.anime_id);
          animeList.push({
            ...animeData,
            order: anime.order,
          });
        },
      );

      await Promise.all([...animePromises]);
      setAnimes(animeList.sort((a, b) => a.order - b.order));
      setFetched(true);
    };

    if (!fetched) {
      fetchAnimes();
    }
  }, [animes, guideInfo, fetched]);

  const [categoryInfo, setCategoryInfo] = useState(
    guideInfo ? guideInfo.category : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = useMemo(() => {
    const result = schema.safeParse(formData);
    return result.success;
  }, [formData, schema]);

  type finalData = {
    author_id: string;
    category_id: number | null;
    title: string;
    description: string | null;
    updated_at?: string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalData: finalData = {
      author_id: formData.authorId,
      category_id: formData.category,
      title: formData.title,
      description: formData.description,
    };
    const animeIds: number[] = animes.map((anime) => anime.id);
    if (guideInfo) finalData.updated_at = formatDatePg(new Date());
    try {
      let id = 0;
      if (guideInfo) {
        id = guideInfo.id;
        const { error } = await supabase
          .from("anime_guides")
          .update({ id: id, ...finalData })
          .eq("id", guideInfo.id);
        if (error) throw new Error(error.message);
        // getting animes that are and aren't uploaded yet
        const newAnimes: Record<string, any>[] = [];
        const existingAnimes: Record<string, any>[] = [];
        const animesToDelete: Record<string, any>[] = [];
        let prevAnimes: Record<string, any>[] = [...guideInfo.animes];
        animes.forEach((anime, index) => {
          const prevRecord = prevAnimes.find((obj) => obj.anime_id == anime.id);
          if (prevRecord) {
            existingAnimes.push({
              ...anime,
              id: prevRecord.id,
              anime_id: anime.id,
              order: index + 1,
            });
            prevAnimes = prevAnimes.filter(
              (obj) => obj.anime_id != prevRecord.id,
            );
          } else {
            newAnimes.push({
              ...anime,
              anime_id: anime.id,
              order: index + 1,
            });
          }
        });
        guideInfo.animes.forEach((anime) => {
          if (!animeIds.includes(anime.anime_id)) {
            animesToDelete.push(anime.id);
          }
        });
        const { error: deleteError } = await supabase
          .from("guides_anime_map")
          .delete()
          .in("id", animesToDelete);
        if (deleteError) throw new Error(deleteError.message);
        const { error: updateError } = await supabase
          .from("guides_anime_map")
          .upsert(
            existingAnimes.map((anime) => ({
              id: anime.id,
              anime_id: anime.anime_id,
              guide_id: id,
              order: anime.order,
            })),
            { onConflict: "id" },
          );
        if (updateError) throw new Error(updateError.message);
        const { error: insertError } = await supabase
          .from("guides_anime_map")
          .insert(
            newAnimes.map((anime) => ({
              anime_id: anime.anime_id,
              guide_id: id,
              date_added: formatDatePg(new Date()),
              order: anime.order,
            })),
          );
        if (insertError) throw new Error(insertError.message);
      } else {
        const { error, data } = await supabase
          .from("anime_guides")
          .insert(finalData)
          .select()
          .single();
        if (error) throw new Error(error.message);
        id = data.id;
        const finalAnimes: animeSubmission[] = animeIds.map(
          (animeId, index) => {
            return {
              anime_id: animeId,
              guide_id: id,
              date_added: formatDatePg(new Date()),
              order: index + 1,
            };
          },
        );
        console.log(finalAnimes);
        const { error: animeError } = await supabase
          .from("guides_anime_map")
          .insert(finalAnimes);
        if (animeError) throw new Error(animeError.message);
      }
      if (id == 0) {
        throw new Error("No ID found.");
      }
      router.refresh();
      router.push(`/guides/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const onAnimesSelect = useCallback((animes: Record<string, any>[]) => {
    setAnimes(animes);
  }, []);

  const setCategory = useCallback((category: Record<string, any> | null) => {
    setFormData((prevData) => ({
      ...prevData,
      category: category ? category.id : null,
    }));
    setCategoryInfo(category);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="my-4 flex justify-center sm:m-4">
      <div className="flex w-full max-w-4xl flex-col items-center gap-4">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex w-full flex-col gap-2">
            <h2 className="text-xl font-bold">About</h2>
            <Input
              size="lg"
              isRequired
              value={formData.title}
              variant="bordered"
              label="Title"
              maxLength={100}
              onValueChange={(text) =>
                setFormData({ ...formData, title: text })
              }
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
          <div className="flex w-full flex-col gap-2">
            <h2 className="text-xl font-bold">Category</h2>
            <CategorySelect category={categoryInfo} callback={setCategory} />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <AddAnime animes={animes} callback={onAnimesSelect} />
        </div>
        <EditableAnimeList animes={animes} callback={onAnimesSelect} />
        <div className="mt-8 flex w-full justify-end gap-4">
          <Button variant="bordered" onPress={() => window.history.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="shadow"
            isLoading={isSubmitting}
            isDisabled={!isFormValid}
          >
            {guideInfo ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  );
}

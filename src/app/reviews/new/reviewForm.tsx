"use client";

import { userAtom } from "@/atoms";
import { Textarea, Image, Button, Spinner, Input } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { Search } from "react-feather";
import supabase from "@/utils/supabaseClient";
import {
  camelize,
  getAnimeDetailsClient,
  searchAnimeClient,
} from "@/utils/utils";
import { debounce } from "lodash";
import AnimeResult from "./AnimeResult";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ReviewForm({ reviewId }: { reviewId?: number }) {
  const [user] = useAtom(userAtom);

  const params = useSearchParams();
  const animeId = Number(params.get("animeId"));
  const [formData, setFormData] = useState({
    authorId: user?.id || "",
    animeId: animeId || null,
    comment: "",
    longReview: "",
    overallScore: "",
    detailedScore: [],
    longReviewPreview: "",
    isDraft: false,
  });
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [selectingAnime, setSelectingAnime] = useState<boolean>(!animeId);
  const [animeQuery, setAnimeQuery] = useState<string>("");
  const [animeResults, setAnimeResults] = useState<any[]>([]);
  const [nextResults, setNextResults] = useState<string | null>(null);

  useEffect(() => {
    if (reviewId && !formData) {
      // Fetch review data from the "reviews" table using Supabase API
      const fetchReviewData = async () => {
        const { data, error } = await camelize(
          supabase.from("reviews").select("*").eq("id", reviewId).single(),
        );

        if (error) {
          console.error("Error fetching review data:", error);
        } else {
          // Populate the form with data from the review
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

          setAnimeDetails(await getAnimeDetailsClient(data.animeId));
        }
      };

      fetchReviewData();
    }
    const fetchAnimeDetails = async () => {
      if (animeId) {
        setAnimeDetails(camelize(await getAnimeDetailsClient(animeId)));
        formData.animeId = animeId;
      }
    };
    if (!animeDetails) fetchAnimeDetails();
  }, [reviewId, animeId, formData, animeDetails]);

  const fetchNextAnimeResults = async () => {
    if (!nextResults) return;
    console.log(nextResults);
    const params = new URLSearchParams(new URL(nextResults).search);
    const results = await searchAnimeClient(
      params.get("q")!,
      Number(params.get("limit")),
      Number(params.get("offset")),
      params.get("fields") || undefined,
    );
    console.log(params.get("offset"));

    console.log(results);
    setAnimeResults([...animeResults, ...results.data]);
    setNextResults(results.paging.next || null);
    console.log(nextResults);
  };

  const debouncedApiCall = debounce(
    async (text: string, limit?: number, offset?: number, fields?: string) => {
      const results = await searchAnimeClient(text);
      setAnimeResults(results.data);
      results.paging?.next !== undefined
        ? setNextResults(results.paging.next)
        : setNextResults(null);
    },
    500,
  );

  const handleAnimeQueryChange = async (text: string) => {
    setAnimeQuery(text);
    debouncedApiCall(text);
  };

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
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="my-4 flex flex-col gap-4">
        <div className="rounded-xl border-4 border-primary-300 p-2">
          <h2 className="text-lg font-bold">Select anime</h2>
          <p className="text-foreground-400">Which anime are you reviewing?</p>
          {!selectingAnime ? (
            <div className="my-2 flex items-center justify-between gap-2 rounded-lg border-2 border-default-200 bg-default-100 p-2">
              {animeDetails ? (
                <div className="flex items-center">
                  <Image
                    alt={animeDetails.title}
                    src={animeDetails.mainPicture.medium}
                    width={40}
                    classNames={{ img: "rounded-lg" }}
                  />
                  <p className="ml-2 text-primary">{animeDetails.title}</p>
                </div>
              ) : (
                <div className="flex w-full justify-center">
                  <Spinner />
                </div>
              )}
              <Button variant="faded" onClick={() => setSelectingAnime(true)}>
                Change
              </Button>
            </div>
          ) : (
            <div className="my-2">
              <Input
                autoComplete="off"
                label="Anime title"
                value={animeQuery}
                onValueChange={handleAnimeQueryChange}
                variant="faded"
                endContent={
                  <div className="flex h-full items-center text-default-500">
                    <Search size={16} />
                  </div>
                }
              />
              <div className="my-4 h-fit overflow-y-scroll rounded-lg border-2 border-default-200 bg-default-100">
                {animeQuery.length > 2 ? (
                  <>
                    {animeResults?.length > 0 ? (
                      <InfiniteScroll
                        next={fetchNextAnimeResults}
                        hasMore={!!nextResults && animeResults.length < 19}
                        endMessage={
                          animeResults.length > 19 ? (
                            <p className="w-full p-4 text-center text-sm text-default-500">
                              Still can&apos;t find it? Try a more specific
                              search.
                            </p>
                          ) : (
                            <p className="w-full p-4 text-center text-sm text-default-500">
                              No more results.
                            </p>
                          )
                        }
                        loader={
                          <div className="my-2 flex w-full justify-center">
                            <Spinner size="sm" />
                          </div>
                        }
                        height={300}
                        dataLength={animeResults.length}
                      >
                        {animeResults.map((anime) => {
                          return (
                            <AnimeResult
                              key={anime.node.id}
                              anime={anime.node}
                            />
                          );
                        })}
                      </InfiniteScroll>
                    ) : (
                      <div className="flex w-full justify-center py-10">
                        <Spinner />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="p-6 py-10 text-sm text-default-500">
                    Search for an anime to see results.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <Textarea
          variant="faded"
          labelPlacement="outside"
          type="textarea"
          label="Comment"
        />
      </div>
    </form>
  );
}

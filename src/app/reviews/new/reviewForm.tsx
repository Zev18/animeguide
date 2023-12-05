"use client";

import { userAtom } from "@/atoms";
import { detailedScore } from "@/types/detailedScore";
import supabase from "@/utils/supabaseClient";
import {
  camelize,
  getAnimeDetailsClient,
  searchAnimeClient,
} from "@/utils/utils";
import {
  Button,
  Image,
  Input,
  Progress,
  Slider,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Star } from "react-feather";
import InfiniteScroll from "react-infinite-scroll-component";
import { z } from "zod";
import AnimeResult from "./AnimeResult";
import DetailedScoreSelect from "./DetailedScoreSelect";
import LongReviewEditor from "./LongReviewEditor";

export default function ReviewForm({ reviewId }: { reviewId?: number }) {
  const commentMaxLength = 250;

  const router = useRouter();

  const [user] = useAtom(userAtom);
  const [detailedScoreId, setDetailedScoreId] = useState<number | null>(null);

  const schema = z.object({
    authorId: z.string({ required_error: "Author ID is required." }),
    animeId: z.number({
      required_error: "Please select an anime.",
      invalid_type_error: "Please select an anime.",
    }),
    comment: z.string().nullable(),
    longReview: z.string().nullable(),
    overallScore: z.number().lte(10).nullable(),
    detailedScore: z
      .object({
        plot: z.number().lte(10),
        characters: z.number().lte(10),
        emotion: z.number().lte(10),
        accessibility: z.number().lte(10),
        audiovisual: z.number().lte(10),
        originality: z.number().lte(10),
      })
      .nullable(),
    longReviewPreview: z.string().nullable(),
    isDraft: z.boolean(),
    updatedAt: z.date().optional(),
  });

  const params = useSearchParams();
  const animeId = Number(params.get("animeId"));
  const [formData, setFormData] = useState({
    authorId: user?.id || "",
    animeId: animeId || null,
    comment: "",
    longReview: "",
    overallScore: 0,
    detailedScore: {
      plot: 0,
      characters: 0,
      emotion: 0,
      accessibility: 0,
      audiovisual: 0,
      originality: 0,
    },
    longReviewPreview: "",
    isDraft: false,
  });
  const [animeDetails, setAnimeDetails] = useState<any>();
  const [selectingAnime, setSelectingAnime] = useState<boolean>(!animeId);
  const [animeQuery, setAnimeQuery] = useState<string>("");
  const [animeResults, setAnimeResults] = useState<any[]>([]);
  const [nextResults, setNextResults] = useState<string | null>(null);

  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [detailedScoreEnabled, setDetailedScoreEnabled] = useState(false);
  const [detailedReviewEnabled, setDetailedReviewEnabled] = useState(false);

  const isFormValid = useMemo(() => {
    const result = schema.safeParse(formData);
    return result.success;
  }, [formData, schema]);

  useEffect(() => {
    if (!formData.overallScore && !formData.comment) {
      setErrorMessage("Either a score or comment is required.");
    } else {
      const result = schema.safeParse(formData);
      if (result.success) {
        setErrorMessage("");
      } else {
        setErrorMessage(result.error.issues[0].message);
      }
    }
  }, [formData, schema]);

  useEffect(() => {
    if (reviewId && !formData) {
      // Fetch review data from the "reviews" table using Supabase API
      const fetchReviewData = async () => {
        const { data, error } = await camelize(
          supabase.from("reviews").select("*").eq("id", reviewId).single(),
        );

        const { data: scoreData, error: scoreError } = await camelize(
          supabase
            .from("detailed_score")
            .select("*")
            .eq("review_id", data.id)
            .single(),
        );

        if (error || scoreError) {
          console.error("Error fetching review data:", error + scoreError);
        } else {
          setDetailedScoreId(data.detailed_score);
          // Populate the form with data from the review
          setFormData({
            authorId: data.authorId,
            animeId: data.animeId,
            comment: data.comment,
            longReview: data.longReview,
            overallScore: Number(data.overallScore),
            detailedScore: {
              plot: Number(scoreData.plot),
              characters: Number(scoreData.characters),
              emotion: Number(scoreData.emotion),
              accessibility: Number(scoreData.accessibility),
              audiovisual: Number(scoreData.audiovisual),
              originality: Number(scoreData.originality),
            },
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

  const updateDetailedScore = useCallback((scores: detailedScore) => {
    setFormData((prevFormData) => ({ ...prevFormData, detailedScore: scores }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLongReview = useCallback(
    (reviewHtml: string, reviewText: string) => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        longReview: reviewHtml,
        longReviewPreview: reviewText,
      }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );

  const fetchNextAnimeResults = async () => {
    if (!nextResults) return;
    const params = new URLSearchParams(new URL(nextResults).search);
    const results = await searchAnimeClient(
      params.get("q")!,
      Number(params.get("limit")),
      Number(params.get("offset")),
      params.get("fields") || undefined,
    );

    // Remove duplicates based on a unique identifier (e.g., 'id')
    const uniqueResults = results.data.filter(
      (result: Record<string, any>) =>
        !animeResults.some((existingResult) => existingResult.id === result.id),
    );

    setAnimeResults([...animeResults, ...results.data]);
    setNextResults(results.paging.next || null);
  };

  const debouncedApiCall = debounce(async (text: string) => {
    const results = await searchAnimeClient(text);
    setAnimeResults(results.data);
    results.paging?.next !== undefined
      ? setNextResults(results.paging.next)
      : setNextResults(null);
  }, 500);

  const handleAnimeQueryChange = async (text: string) => {
    setAnimeQuery(text);
    debouncedApiCall(text);
  };

  const averageScore = (scores: detailedScore): number => {
    if (!scores) return 0;
    return (
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.values(scores).length
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const finalData = {
      ...formData,
      overallScore: formData.overallScore
        ? formData.overallScore
        : averageScore(formData.detailedScore),
      detailedScore: detailedScoreEnabled ? formData.detailedScore : null,
      longReview: detailedReviewEnabled ? formData.longReview : null,
      author_id: user?.id,
    };
    let finalReviewId = reviewId;
    if (!finalData.animeId || !finalData.authorId) return;
    try {
      if (reviewId) {
        const { error } = await supabase.from("reviews").upsert([
          {
            id: reviewId,
            comment: finalData.comment,
            overall_score: finalData.overallScore,
            long_review: finalData.longReview,
            long_review_preview: finalData.longReviewPreview,
            is_draft: finalData.isDraft,
            anime_id: finalData.animeId,
            author_id: finalData.authorId,
          },
        ]);
        if (error) throw new Error("Error upserting review.");
      } else {
        const { data, error } = await supabase
          .from("reviews")
          .insert([
            {
              comment: finalData.comment,
              overall_score: finalData.overallScore,
              long_review: finalData.longReview,
              long_review_preview: finalData.longReviewPreview,
              is_draft: finalData.isDraft,
              anime_id: finalData.animeId,
              author_id: finalData.authorId,
            },
          ])
          .select()
          .single();
        if (error) throw new Error("Error inserting review.");
        finalReviewId = data.id;
      }
      if (!finalReviewId) throw new Error("Error retrieving ID.");
      if (detailedScoreId) {
        const { error } = await supabase
          .from("detailed_score")
          .update({ ...finalData.detailedScore, review_id: finalReviewId })
          .eq("id", detailedScoreId);
        if (error) throw new Error("Error updating detailed score.");
      } else if (finalData.detailedScore) {
        const { error } = await supabase
          .from("detailed_score")
          .insert({ ...finalData.detailedScore, review_id: finalReviewId });
        if (error) throw new Error("Error inserting detailed score.");
      }
      router.push(`/reviews/${finalReviewId}`);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="my-4 flex justify-center sm:m-4"
    >
      <div className="my-4 flex w-full max-w-4xl flex-col gap-4">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border-4 border-primary-300 p-4">
            <h2 className="text-lg font-bold">Select anime</h2>
            <p className="text-sm text-foreground-400">
              Which anime are you reviewing?
            </p>
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
                  isClearable
                  label="Search anime"
                  value={animeQuery}
                  onValueChange={handleAnimeQueryChange}
                  variant="faded"
                />
                <div className="mt-4 h-fit rounded-lg border-2 border-default-200 bg-default-100">
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
                                callback={(anime) => {
                                  setSelectingAnime(false);
                                  setAnimeDetails(camelize(anime));
                                  setFormData({
                                    ...formData,
                                    animeId: anime.id,
                                  });
                                }}
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
          <div className="flex flex-col gap-4 rounded-xl border-4 border-danger-300 p-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">Required section</h2>
              <p className="text-sm text-foreground-400">
                Please either leave a comment or rating. Only ratings above zero
                will be counted.
              </p>
            </div>
            <div>
              <Textarea
                value={formData.comment}
                onValueChange={(text) =>
                  setFormData({ ...formData, comment: text })
                }
                variant="faded"
                labelPlacement="outside"
                type="textarea"
                label="Comment"
                classNames={{ input: "text-base" }}
              />
              {formData.comment.length > 0 && (
                <Progress
                  label="Characters"
                  className="mt-2"
                  showValueLabel
                  valueLabel={
                    formData.comment.length > commentMaxLength ? (
                      <div className="text-danger-400">
                        {formData.comment.length}/{commentMaxLength}
                      </div>
                    ) : (
                      <p>
                        {formData.comment.length}/{commentMaxLength}
                      </p>
                    )
                  }
                  value={formData.comment.length}
                  size="sm"
                  color={
                    formData.comment.length > commentMaxLength
                      ? "danger"
                      : "primary"
                  }
                  maxValue={commentMaxLength}
                />
              )}
            </div>
            <div>
              <Slider
                label="Rating"
                step={0.5}
                maxValue={10}
                value={formData.overallScore}
                formatOptions={{
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }}
                onChange={(value) =>
                  setFormData({ ...formData, overallScore: Number(value) })
                }
                classNames={{
                  label: "text-base mb-2",
                  value: "text-base mb-2 font-bold text-primary",
                }}
                endContent={
                  <Star
                    className="text-primary"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        overallScore: Math.min(10, formData.overallScore + 0.5),
                      })
                    }
                  />
                }
                startContent={
                  <Star
                    className="text-primary"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        overallScore: Math.max(0, formData.overallScore - 0.5),
                      })
                    }
                    size={16}
                    strokeWidth={3}
                  />
                }
              />
            </div>
          </div>
        </div>
        <DetailedScoreSelect
          updateScore={updateDetailedScore}
          defaultScores={formData?.detailedScore}
          isActive={(selected) => setDetailedScoreEnabled(selected)}
        />
        <LongReviewEditor
          updateText={updateLongReview}
          defaultText={formData?.longReview}
          isActive={(selected) => setDetailedReviewEnabled(selected)}
        />
        <div className="my-4 flex w-full flex-row-reverse items-center justify-between gap-4">
          <Button
            variant="shadow"
            color="primary"
            className="min-w-max"
            isDisabled={!isFormValid}
            isLoading={submitting}
            type="submit"
          >
            Create Review
          </Button>
          {errorMessage && (
            <p className="shrink text-sm text-danger">{errorMessage}</p>
          )}
        </div>
      </div>
    </form>
  );
}

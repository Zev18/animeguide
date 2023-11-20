import animePlaceholder from "@/assets/images/animePlaceholder.jpeg";
import RadarChart from "@/components/RadarChart";
import { Button, Card, CardBody, Image } from "@nextui-org/react";
import Link from "next/link";
import { ArrowRight, Star } from "react-feather";

export default function ReviewCard({
  review,
}: {
  review: Record<string, any>;
}) {
  const stars = [];
  for (let i = 0; i < Math.floor(review.overallScore / 2); i++) {
    stars.push(<Star key={i} />);
  }
  if (review.overallScore % 2 !== 0) {
    stars.push(<Star key={stars.length} strokeWidth={3} size={12} />);
  }

  const smallText = review?.anime.title && review.anime.title.length > 30;

  return (
    <Card className="max-w-prose p-2">
      <CardBody className="gap-2 sm:gap-4">
        <div className="flex w-full flex-col justify-between sm:flex-row sm:items-center sm:gap-4">
          <div className="flex max-h-min w-full items-center gap-4">
            <Link
              href={`/anime/${review.anime.id}`}
              className="relative max-h-full grow basis-16"
            >
              <Image
                src={
                  Object.keys(review.anime).length > 0
                    ? review.anime.mainPicture.medium
                    : animePlaceholder
                }
                className="max-h-[5rem] rounded object-contain hover:scale-95"
                alt={review.anime.title}
              />
            </Link>
            <div className="flex grow-[2000] basis-0 items-center sm:min-h-[5rem]">
              <Link
                href={`/anime/${review.anime.id}`}
                className={`${smallText ? "text-xl" : "text-2xl"} text-primary`}
              >
                {review.anime.title}
              </Link>
            </div>
          </div>
          <div className="flex w-full items-center justify-evenly gap-4 sm:w-max sm:justify-end">
            <div className="flex w-max flex-col text-center">
              <p>
                <span className="font-bold text-primary">
                  {review.overallScore}
                </span>{" "}
                / 10
              </p>
              <div className="flex items-center justify-center text-primary">
                {stars.map((star) => star)}
              </div>
            </div>
            <RadarChart size={65} data={review.detailedScore[0]} />
          </div>
        </div>
        <div className="flex flex-col">
          <Link
            href={`/reviews/${review.id}`}
            className="mb-4 rounded-xl border-3 border-primary/50 p-2 px-4 text-xl font-semibold"
          >
            {review.comment}
          </Link>
          {review.longReviewPreview && (
            <>
              <Link href={`/reviews/${review.id}`} className="relative">
                <p className="line-clamp-4">{review.longReviewPreview}</p>
                <div className="absolute bottom-0 flex h-[5rem] w-full justify-end bg-gradient-to-b from-transparent to-background"></div>
              </Link>

              <div className="flex w-full justify-end">
                <Button
                  color="primary"
                  variant="light"
                  as={Link}
                  href={`/reviews/${review.id}`}
                >
                  Read more <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

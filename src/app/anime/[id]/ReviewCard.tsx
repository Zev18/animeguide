import animePlaceholder from "@/assets/images/animePlaceholder.jpeg";
import RadarChart from "@/components/RadarChart";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Spinner } from "@nextui-org/spinner";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "react-feather";

export default function ReviewCard({
  review,
}: {
  review: Record<string, any>;
}) {
  if (!review) return;

  const stars = [];
  for (let i = 0; i < Math.floor(review.overallScore / 2); i++) {
    stars.push(<Star key={i} />);
  }
  if (review.overallScore % 2 !== 0) {
    stars.push(<Star key={stars.length} strokeWidth={3} size={12} />);
  }

  return (
    <Card className="w-full max-w-prose p-2">
      <CardBody className="gap-2 sm:gap-4">
        <div className="flex w-full flex-col justify-between sm:flex-row sm:items-center sm:gap-4">
          <div className="flex max-h-min w-full items-center gap-4">
            <Link
              href={`/anime/${review.users.username}`}
              className="relative max-h-full"
            >
              <Avatar
                src={review.users.avatarUrl}
                alt={review.users.displayName}
                size="lg"
              />
            </Link>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <Link
                  href={`/user/${review.users.username}`}
                  className="text-lg text-primary"
                >
                  {review.users.displayName}
                </Link>
                <p className="text-foreground-400">@{review.users.username}</p>
              </div>
              <p className="flex items-center gap-2 text-sm text-foreground-400">
                <Clock size={16} />{" "}
                {format(new Date(review.createdAt), "dd MMM yyyy")}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-evenly gap-4 sm:w-max sm:justify-end">
            <div className="flex w-max flex-col text-center">
              {review.overallScore > 0 && (
                <p>
                  <span className="font-bold text-primary">
                    {review.overallScore}
                  </span>{" "}
                  / 10
                </p>
              )}
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

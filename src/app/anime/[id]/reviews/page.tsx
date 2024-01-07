import { getAnimeDetails } from "@/utils/utils";
import { Image } from "@nextui-org/image";
import { ChevronLeft } from "react-feather";
import BackButton from "./BackButton";
import ReviewsPagination from "./ReviewsPagination";

export default async function AllReviews({
  params,
}: {
  params: { id: string };
}) {
  const anime = await getAnimeDetails(Number(params.id));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full">
        <BackButton anime={anime} />
      </div>
      <div className="w-full">
        <h1 className="text-2xl font-bold">All Reviews</h1>
        <ReviewsPagination animeId={Number(params.id)} />
      </div>
    </div>
  );
}

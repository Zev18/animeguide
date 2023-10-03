"use client";

import UserAnimeList from "@/types/userAnimeList";
import { Tab, Tabs } from "@nextui-org/react";
import AnimeTab from "./AnimeTab";
import ReviewsTab from "./ReviewsTab";

export default function UserTabs({
  className,
  animeList,
  username,
}: {
  className?: string;
  animeList?: UserAnimeList;
  username: string;
}) {
  return (
    <div className={className}>
      <Tabs aria-label="options" fullWidth>
        <Tab key="reviews" title="Reviews">
          <ReviewsTab username={username} />
        </Tab>
        <Tab key="guides" title="Guides"></Tab>
        <Tab key="animes" title="Animes">
          <AnimeTab animeList={animeList} username={username} />
        </Tab>
      </Tabs>
    </div>
  );
}

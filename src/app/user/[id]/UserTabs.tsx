"use client";

import User from "@/types/user";
import UserAnimeList from "@/types/userAnimeList";
import { Tab, Tabs } from "@nextui-org/react";
import AnimeTab from "./AnimeTab";
import ReviewsTab from "./ReviewsTab";
import GuidesTab from "./GuidesTab";

export default function UserTabs({
  className,
  animeList,
  userInfo,
  reviews,
  guides,
}: {
  className?: string;
  animeList?: UserAnimeList;
  userInfo: User;
  reviews: Record<string, any>[];
  guides: Record<string, any>[];
}) {
  return (
    <div className={className}>
      <Tabs aria-label="options" fullWidth>
        <Tab key="reviews" title="Reviews">
          <ReviewsTab username={userInfo.username} reviews={reviews} />
        </Tab>
        <Tab key="guides" title="Guides">
          <GuidesTab guides={guides} username={userInfo.username} />
        </Tab>
        {userInfo.malId && (
          <Tab key="animes" title="Animes">
            <AnimeTab animeList={animeList} username={userInfo.username} />
          </Tab>
        )}
      </Tabs>
    </div>
  );
}

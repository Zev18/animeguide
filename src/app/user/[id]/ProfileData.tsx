"use client";

import { userAtom } from "@/atoms";
import User from "@/types/user";
import { hiRes, malUrl, timestampToDate } from "@/utils/utils";
import { Card, CardBody } from "@nextui-org/card";
import { Link } from "@nextui-org/link";
import { Image as Picture } from "@nextui-org/image";
import { useAtom } from "jotai";
import Image from "next/image";

export default function ProfileData({
  username,
  fetchedData,
}: {
  username: string;
  fetchedData: User;
}) {
  const [user] = useAtom(userAtom);

  // use the fetched data if the user is not logged in
  const userInfo = user?.username === username ? user : fetchedData;
  console.log(hiRes(256, userInfo.avatarUrl));

  return (
    <Card isBlurred shadow="sm">
      <CardBody>
        <div className="grid grid-cols-2 items-center gap-6 md:flex md:gap-12">
          <Picture
            as={Image}
            src={hiRes(256, userInfo.avatarUrl)}
            alt={userInfo.displayName}
            width={256}
            height={256}
            isBlurred
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {userInfo.displayName}
              </h3>
              <p className="text-foreground-400">@{userInfo.username}</p>
            </div>
            {userInfo.malId && (
              <Link showAnchorIcon isExternal href={malUrl(userInfo.malId)}>
                View Anime List
              </Link>
            )}
            <p className="text-sm text-foreground-400">
              {"Joined " + timestampToDate(userInfo.createdAt)}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

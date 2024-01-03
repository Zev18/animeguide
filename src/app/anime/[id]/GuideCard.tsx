"use client";

import { Avatar } from "@nextui-org/avatar";
import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import { useRouter } from "next/navigation";
import { Bookmark, Eye, List } from "react-feather";

export default function GuideCard({ guide }: { guide: Record<string, any> }) {
  const iconSize = 14;

  const router = useRouter();

  return (
    <Card
      as="div"
      className="w-full max-w-xl p-2"
      isPressable
      onPress={() => router.push(`/guides/${guide.id}`)}
    >
      <CardBody className="p-4">
        <div>
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <Link
                href={`/guides/${guide.id}`}
                className="text-xl text-primary"
              >
                {guide.title}
              </Link>
              {guide.categories && (
                <Chip color="primary" variant="flat">
                  {guide.categories.category}
                </Chip>
              )}
            </div>
            <p className="text-sm text-foreground-500">{guide.description}</p>
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-4 text-tiny text-foreground-500">
                <div className="flex items-center gap-1">
                  <List size={iconSize} />
                  {guide.size ? guide.size : 0}
                </div>
                <div className="flex items-center gap-1">
                  <Bookmark size={iconSize} />
                  {guide.user_count ? guide.user_count : 0}
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={iconSize} />
                  {guide.views ? guide.views : 0}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar src={guide.avatar_url} size="sm" />
                <Link href={"/user/" + guide.username}>
                  {guide.display_name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

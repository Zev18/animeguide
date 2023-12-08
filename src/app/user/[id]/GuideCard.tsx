import { userAtom } from "@/atoms";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, List, MoreVertical } from "react-feather";

export default function GuideCard({ guide }: { guide: Record<string, any> }) {
  const iconSize = 13;
  const [user] = useAtom(userAtom);

  const router = useRouter();

  return (
    <Card className="w-full max-w-xl p-2">
      <CardBody className="p-4">
        <div className="flex w-full justify-between gap-8">
          <div className="flex flex-col gap-4">
            <Link href={`/guides/${guide.id}`} className="text-xl text-primary">
              {guide.title}
            </Link>
            <p className="text-sm text-foreground-500">{guide.description}</p>
            <div className="flex items-center gap-4 text-tiny text-foreground-500">
              <div className="flex items-center gap-1">
                <List size={iconSize} />
                {guide.animeCount}
              </div>
              <div className="flex items-center gap-1">
                <Bookmark size={iconSize} />
                {guide.savedCount}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-end relative hidden max-h-full gap-2 sm:flex">
              {guide.animes &&
                guide.animes.map(
                  (anime: Record<string, any>, index: number) => (
                    <Image
                      className="max-h-full object-contain"
                      width={60}
                      key={index}
                      alt={anime.title}
                      src={anime.mainPicture.medium}
                    />
                  ),
                )}
              <div className="absolute bottom-0 z-10 flex h-full w-full justify-end bg-gradient-to-l from-transparent to-background" />
            </div>
            {user?.username == guide.users.username && (
              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" className="opacity-50">
                      <MoreVertical size={iconSize + 4} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label={`guide options ${guide.id}`}>
                    <DropdownItem
                      key="edit"
                      onClick={() => router.push(`/guides/${guide.id}/edit`)}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

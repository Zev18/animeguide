import { userAtom } from "@/atoms";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, Eye, List, MoreVertical } from "react-feather";
import supabase from "@/utils/supabaseClient";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";

export default function GuideCard({
  guide,
  callback,
}: {
  guide: Record<string, any>;
  callback: (id: number) => void;
}) {
  const iconSize = 14;
  const [user] = useAtom(userAtom);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  const deleteGuide = async (id: number) => {
    if (!user) return;
    const { error } = await supabase.from("anime_guides").delete().eq("id", id);
    if (error) {
      console.log(error);
      return;
    }
    callback(id);
  };

  return (
    <Card
      as="div"
      className="w-full max-w-xl p-2"
      isPressable
      onPress={() => router.push(`/guides/${guide.id}`)}
    >
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
                {guide.animeCount ? guide.animeCount : 0}
              </div>
              <div className="flex items-center gap-1">
                <Bookmark size={iconSize} />
                {guide.savedCount ? guide.savedCount : 0}
              </div>
              <div className="flex items-center gap-1">
                <Eye size={iconSize} />
                {guide.views ? guide.views : 0}
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
                      onPress={() => router.push(`/guides/${guide.id}/edit`)}
                    >
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      onPress={onOpen}
                    >
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Modal isOpen={isOpen} onClose={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader>Delete {guide.title}?</ModalHeader>
                        <ModalBody>This can&apos;t be undone.</ModalBody>
                        <ModalFooter className="">
                          <Button
                            className="grow sm:grow-0"
                            color="primary"
                            onPress={onClose}
                            variant="flat"
                          >
                            Cancel
                          </Button>
                          <Button
                            className="grow sm:grow-0"
                            color="danger"
                            variant="flat"
                            onPress={() => {
                              deleteGuide(guide.id);
                            }}
                          >
                            Delete
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

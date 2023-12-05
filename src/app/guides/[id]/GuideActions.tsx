"use client";

import { userAtom } from "@/atoms";
import supabase from "@/utils/supabaseClient";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { BookmarkCheck, BookmarkX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Edit, Trash2 } from "react-feather";

export default function GuideActions({
  guideInfo,
}: {
  guideInfo: Record<string, any>;
}) {
  const [user] = useAtom(userAtom);
  const [isSaved, setIsSaved] = useState(false);
  const isCreator = guideInfo.users.username == user?.username;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  useEffect(() => {
    const getSavedStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("guides_users_map")
          .select("id")
          .eq("user_id", user.id)
          .eq("guide_id", guideInfo.id)
          .maybeSingle();

        if (error) {
          return;
        }
        setIsSaved(data ? true : false);
      }
    };

    getSavedStatus();
  }, [user, guideInfo]);

  const handleSave = async () => {
    if (!user) {
      const params = new URLSearchParams({
        redirect: `/guides/${guideInfo.id}`,
      });
      router.push("/login?" + params.toString());
      return;
    } else {
      if (isSaved) {
        setIsSaved(false);
        await supabase
          .from("guides_users_map")
          .delete()
          .eq("user_id", user.id)
          .eq("guide_id", guideInfo.id);
      } else {
        setIsSaved(true);
        await supabase.from("guides_users_map").upsert({
          guide_id: guideInfo.id,
          user_id: user.id,
        });
      }
    }
  };

  const deleteGuide = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("anime_guides")
      .delete()
      .eq("id", guideInfo.id);
    if (error) {
      console.log(error);
    } else {
      router.push(`/user/${user.username}`);
    }
  };

  return isCreator ? (
    <div className="flex gap-1">
      <Tooltip content="Edit" delay={300} closeDelay={0}>
        <Button
          variant="light"
          color="primary"
          startContent={<Edit size={20} />}
          onPress={() => router.push(`/guides/${guideInfo.id}/edit`)}
        >
          Edit
        </Button>
      </Tooltip>
      <Tooltip content="Delete" delay={300} closeDelay={0}>
        <Button
          variant="light"
          color="danger"
          startContent={<Trash2 size={20} />}
          onPress={onOpen}
        >
          Delete
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Delete {guideInfo.title}?</ModalHeader>
              <ModalBody>This can&apos;t be undone.</ModalBody>
              <ModalFooter>
                <Button color="primary" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                    deleteGuide();
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
  ) : (
    <Button
      color="primary"
      variant={isSaved ? "bordered" : "shadow"}
      startContent={
        isSaved ? <BookmarkX size={20} /> : <BookmarkCheck size={20} />
      }
      onClick={handleSave}
    >
      {isSaved ? "Unsave" : "Save"}
    </Button>
  );
}

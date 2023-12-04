"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { BookmarkCheck, BookmarkX } from "lucide-react";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms";
import { usePathname, useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { Edit, Link } from "react-feather";

export default function GuideActions({
  guideInfo,
}: {
  guideInfo: Record<string, any>;
}) {
  const [user] = useAtom(userAtom);
  const [isSaved, setIsSaved] = useState(false);
  const isCreator = guideInfo.users.username == user?.username;

  const [pathname, setPathname] = useState("");
  const slug = usePathname();

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

  useEffect(() => {
    if (window && !pathname) {
      setPathname(window.location.origin + slug);
    }
  }, [pathname, slug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pathname);
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
    }
  };

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

  return (
    <div className="flex justify-end gap-1">
      <Tooltip content="Copy link" closeDelay={0} delay={300} size="sm">
        <Button
          isIconOnly
          variant="light"
          startContent={<Link size={20} />}
          onClick={copyToClipboard}
        />
      </Tooltip>
      {isCreator ? (
        <>
          <Button
            isIconOnly
            variant="light"
            color="primary"
            startContent={<Edit size={20} />}
            onClick={() => router.push(`/guides/${guideInfo.id}/edit`)}
          />
        </>
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
      )}
    </div>
  );
}

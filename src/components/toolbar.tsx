"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Underline,
  Heading,
  Image,
} from "lucide-react";
import * as Toggle from "@radix-ui/react-toggle";
import React, { useMemo, useState } from "react";
import Separator from "./separator";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Tooltip } from "@nextui-org/tooltip";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

type Props = {
  editor: Editor | null;
};

export default function Toolbar({ editor }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [url, setUrl] = useState("");

  const iconSize = 16;

  const addImage = () => {
    if (url === "" || !editor || isInvalidUrl) return;

    editor.chain().focus().setImage({ src: url, alt: "" }).run();
    setUrl("");
  };

  const isImage = (url: string) =>
    url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/);

  const isInvalidUrl = useMemo(() => {
    if (url === "") return false;

    return isImage(url) ? false : true;
  }, [url]);

  if (!editor) return null;

  const className =
    "rounded data-[state=on]:bg-foreground-200 p-[7px] m-[2px] flex-wrap";

  return (
    <div className="mt-2 flex items-center rounded-t-lg border-2 border-foreground-200 p-1">
      <Tooltip
        content="Heading"
        placement="bottom"
        offset={0}
        delay={400}
        closeDelay={0}
      >
        <Toggle.Root
          aria-label="toggle heading"
          className={className}
          pressed={editor.isActive("heading")}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading size={iconSize} />
        </Toggle.Root>
      </Tooltip>
      <Separator />
      <Tooltip
        content="Bold"
        placement="bottom"
        offset={0}
        delay={400}
        closeDelay={0}
      >
        <Toggle.Root
          aria-label="toggle bold"
          className={className}
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={iconSize} />
        </Toggle.Root>
      </Tooltip>
      <Tooltip
        content="Italic"
        placement="bottom"
        offset={0}
        delay={400}
        closeDelay={0}
      >
        <Toggle.Root
          aria-label="toggle italic"
          className={className}
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={iconSize} />
        </Toggle.Root>
      </Tooltip>
      <Tooltip
        content="Underline"
        placement="bottom"
        offset={0}
        delay={400}
        closeDelay={0}
      >
        <Toggle.Root
          aria-label="toggle underline"
          className={className}
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline size={iconSize} />
        </Toggle.Root>
      </Tooltip>
      <Tooltip
        content="Strikethrough"
        placement="bottom"
        offset={0}
        delay={400}
        closeDelay={0}
      >
        <Toggle.Root
          aria-label="toggle strikethrough"
          className={className}
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={iconSize} />
        </Toggle.Root>
      </Tooltip>
      <Separator />
      <Tooltip
        content="Bullet list"
        placement="bottom"
        offset={0}
        delay={400}
        closeDelay={0}
      >
        <Toggle.Root
          aria-label="toggle bullet list"
          className={className}
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List size={iconSize} />
        </Toggle.Root>
      </Tooltip>
      <Tooltip
        content="Numbered list"
        placement="bottom"
        offset={0}
        delay={400}
        closeDelay={0}
      >
        <Toggle.Root
          aria-label="toggle numbered list"
          className={className}
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered size={iconSize} />
        </Toggle.Root>
      </Tooltip>
      <Tooltip
        content="Add image"
        placement="bottom"
        delay={400}
        closeDelay={0}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image
          size={iconSize}
          onClick={onOpen}
          className="m-[9px] cursor-pointer"
        />
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add an image</ModalHeader>
              <ModalBody>
                <p>
                  Paste the an image&apos;s URL to insert it into your review.
                </p>
                <Input
                  label="Image URL"
                  variant="faded"
                  value={url}
                  onValueChange={setUrl}
                  isInvalid={isInvalidUrl}
                  color={isInvalidUrl ? "danger" : "default"}
                  errorMessage={isInvalidUrl && "URL must link to an image."}
                />
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose} variant="light">
                  Close
                </Button>
                <Button
                  onClick={() => {
                    addImage();
                    onClose();
                  }}
                  variant="shadow"
                  color="primary"
                  className="bg-primary"
                >
                  Insert
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

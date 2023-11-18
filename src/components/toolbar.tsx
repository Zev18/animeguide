"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Heading,
} from "lucide-react";
import * as Toggle from "@radix-ui/react-toggle";
type Props = {
  editor: Editor | null;
};

import React from "react";
import Separator from "./separator";

export default function Toolbar({ editor }: Props) {
  if (!editor) return null;

  const iconSize = 16;

  const className =
    "rounded data-[state=on]:bg-foreground-200 p-[7px] m-[2px] flex-wrap";

  return (
    <div className="mt-2 flex items-center rounded-t-lg border-2 border-foreground-200 p-1">
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
      <Separator />
      <Toggle.Root
        aria-label="toggle bold"
        className={className}
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={iconSize} />
      </Toggle.Root>
      <Toggle.Root
        aria-label="toggle italic"
        className={className}
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={iconSize} />
      </Toggle.Root>
      <Toggle.Root
        aria-label="toggle underline"
        className={className}
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={iconSize} />
      </Toggle.Root>
      <Toggle.Root
        aria-label="toggle strikethrough"
        className={className}
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={iconSize} />
      </Toggle.Root>
      <Separator />
      <Toggle.Root
        aria-label="toggle bullet list"
        className={className}
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={iconSize} />
      </Toggle.Root>
      <Toggle.Root
        aria-label="toggle numbered list"
        className={className}
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <List size={iconSize} />
      </Toggle.Root>
    </div>
  );
}

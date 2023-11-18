import { useEditor, EditorContent } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./toolbar";
import { twMerge } from "tailwind-merge";

const Editor = ({
  text,
  onChange,
  className,
}: {
  text: string;
  onChange: (text: string) => void;
  className?: string;
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: text,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert block w-full rounded-b-lg border border-foreground-200 bg-foreground-50 p-2.5 border-t-0 text-sm focus:outline-none border-2 lg:prose-lg xl:prose-2xl max-w-full min-h-[10rem]",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      console.log(editor.getHTML());
    },
  });

  return (
    <div className={twMerge("flex flex-col justify-stretch", className)}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;

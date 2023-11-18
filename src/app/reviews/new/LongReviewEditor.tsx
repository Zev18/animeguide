import Editor from "@/components/Editor";
import { Spinner, Switch } from "@nextui-org/react";
import { Suspense, useState } from "react";

export default function LongReviewEditor({
  updateText,
  defaultText,
}: {
  updateText: (text: string) => void;
  defaultText?: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [md, setMd] = useState(defaultText || "");

  return (
    <div>
      <div className="flex w-full justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Detailed review</h2>
          <p className="text-sm text-foreground-500">
            Write a full-length review with full markdown support.
          </p>
        </div>
        <Switch isSelected={enabled} onValueChange={setEnabled} />
      </div>
      {enabled && (
        <Suspense fallback={<Spinner />}>
          <Editor onChange={updateText} text={md} className="my-4" />
        </Suspense>
      )}
    </div>
  );
}

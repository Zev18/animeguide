import React from "react";
import GuideCard from "./GuideCard";

export default function GuidesSection({
  guides,
  count = 0,
}: {
  guides: Record<string, any>[] | null;
  count: number | null;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-4 lg:shrink">
      <div className="w-full">
        <h2 className="text-2xl font-bold">
          Guides containing this anime{" "}
          <span className="ml-2 text-lg font-normal text-foreground-400">
            ({count})
          </span>
        </h2>
      </div>
      {guides ? (
        <div className="grid w-full max-w-4xl grid-cols-1 items-center justify-center gap-2 md:grid-cols-2 lg:grid-cols-1">
          {guides.map((guide) => (
            <div key={guide.id} className="flex w-full justify-center">
              <GuideCard guide={guide} />
            </div>
          ))}
        </div>
      ) : (
        <div>No guides found.</div>
      )}
    </div>
  );
}

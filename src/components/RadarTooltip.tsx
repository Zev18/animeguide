import { getAverage } from "@/utils/utils";
import { Progress } from "@nextui-org/react";
import { capitalize } from "lodash";

export default function RadarTooltip({
  scores = {},
}: {
  scores: Record<string, number>;
}) {
  const scoreKeys: string[] = Object.keys(scores) || [];

  return (
    <div className="pb-2">
      <div className="flex items-center justify-between">
        <p className="my-2 mr-10 font-bold">Detailed score</p>
        <p className="text-tiny italic text-foreground-400">
          Avg:{" "}
          <span className="ml-2 rounded-lg bg-primary p-2 py-1 text-sm font-bold not-italic text-background">
            {getAverage(Object.values(scores))}
          </span>
        </p>
      </div>
      <div className="w-sm grid grid-cols-2 gap-4">
        {scoreKeys.map((score) => (
          <Progress
            size="sm"
            key={score}
            maxValue={10}
            value={scores[score]}
            showValueLabel
            label={capitalize(score)}
            formatOptions={{ style: "decimal" }}
            classNames={{
              label: "text-tiny mr-4",
              value: "text-tiny font-bold text-primary",
            }}
          />
        ))}
      </div>
    </div>
  );
}

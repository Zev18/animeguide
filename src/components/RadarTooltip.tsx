import { getAverage } from "@/utils/utils";
import { Progress } from "@nextui-org/progress";
import { capitalize } from "lodash";

const size = 10;

import Access from "../assets/vector/radar-chart/access";
import Book from "../assets/vector/radar-chart/book";
import Film from "../assets/vector/radar-chart/film";
import Heart from "../assets/vector/radar-chart/heart";
import Palette from "../assets/vector/radar-chart/palette";
import People from "../assets/vector/radar-chart/people";

const icons = [
  <Book key={1} size={size} />,
  <People key={2} size={size} />,
  <Heart key={3} size={size} />,
  <Access key={4} size={size} />,
  <Film key={5} size={size} />,
  <Palette key={6} size={size} />,
];

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
        {scoreKeys.map((score, index) => (
          <Progress
            size="sm"
            key={score}
            maxValue={10}
            value={scores[score]}
            showValueLabel
            label={
              <div className="flex min-w-max items-center gap-2">
                <span className="text-default-500">{icons[index]}</span>{" "}
                {capitalize(score)}
              </div>
            }
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

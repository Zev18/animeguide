import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import parse from "html-react-parser";
import { capitalize } from "lodash";
import RadarTooltip from "./RadarTooltip";

const radar = require("svg-radar-chart");
const stringify = require("virtual-dom-stringify");

export default function RadarChart({
  data,
  size = 75,
}: {
  data: Record<string, number>;
  size?: number;
}) {
  if (data) delete data.id;
  const columns: Record<string, any> = { ...data };
  let graphData: Record<string, any> = { ...data };
  for (const key in graphData) {
    graphData[key] = graphData[key] / 10;
  }

  graphData = [{ class: "anime", ...graphData }];

  for (const key in columns) {
    columns[key] = capitalize(key);
  }

  const chart = radar(columns, graphData, {
    scales: 1,
    captions: false,
    shapeProps: () => ({ className: "shape anime" }),
  });

  const svg = (
    <svg
      version="1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      {parse(stringify(chart))}
    </svg>
  );

  return (
    <Popover>
      <PopoverTrigger>
        <button>{svg}</button>
      </PopoverTrigger>
      <PopoverContent>
        <RadarTooltip scores={data} />
      </PopoverContent>
    </Popover>
  );
}

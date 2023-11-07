import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import parse from "html-react-parser";
import { capitalize } from "lodash";
import RadarTooltip from "./RadarTooltip";

import Access from "../assets/vector/radar-chart/access";
import Book from "../assets/vector/radar-chart/book";
import Film from "../assets/vector/radar-chart/film";
import Heart from "../assets/vector/radar-chart/heart";
import Palette from "../assets/vector/radar-chart/palette";
import People from "../assets/vector/radar-chart/people";

const radar = require("svg-radar-chart");
const stringify = require("virtual-dom-stringify");

export default function RadarChart({
  data,
  size = 75,
  iconSize = 10,
}: {
  data: Record<string, number>;
  size?: number;
  iconSize?: number;
}) {
  if (data) delete data.id;
  const columns: Record<string, any> = { ...data };
  let graphData: Record<string, any> = { ...data, meta: { color: "#30ddff" } };
  for (const key in graphData) {
    graphData[key] = graphData[key] / 10;
  }

  graphData = [{ class: "anime", ...graphData }];

  for (const key in columns) {
    columns[key] = capitalize(key);
  }

  console.log(columns);
  console.log(graphData);

  if (Object.keys(columns).length === 0) return;

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
        <button>
          <div className="relative m-3 text-default-400">
            {svg}
            <Book
              className="absolute left-[50%] top-[.1rem] -translate-x-1/2 translate-y-[-100%]"
              size={iconSize}
            />
            <Access
              className="absolute bottom-[.1rem] left-[50%] -translate-x-1/2 translate-y-[100%]"
              size={iconSize}
            />
            <Film
              className="absolute bottom-[25%] left-1 -translate-x-[100%] translate-y-1/2"
              size={iconSize}
            />
            <Heart
              className="absolute bottom-[25%] right-1 translate-x-[100%] translate-y-1/2"
              size={iconSize}
            />
            <People
              className="absolute right-1 top-[25%] -translate-y-1/2 translate-x-[100%]"
              size={iconSize}
            />
            <Palette
              className="absolute left-1 top-[25%] -translate-x-[100%] -translate-y-1/2"
              size={iconSize}
            />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <RadarTooltip scores={data} />
      </PopoverContent>
    </Popover>
  );
}

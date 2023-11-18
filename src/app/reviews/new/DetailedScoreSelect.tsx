import RadarChart from "@/components/RadarChart";
import ChartIcon from "@/components/chartIcon";
import { detailedScore } from "@/types/detailedScore";
import { Accordion, AccordionItem, Slider, Switch } from "@nextui-org/react";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { Minus, Plus } from "react-feather";

const emptyScoreValues = {
  plot: 0,
  characters: 0,
  emotion: 0,
  accessibility: 0,
  audiovisual: 0,
  originality: 0,
};

const categoriesToIcon: Record<string, string> = {
  plot: "book",
  characters: "people",
  emotion: "heart",
  accessibility: "access",
  audiovisual: "film",
  originality: "palette",
};

const categoryDescriptions: Record<string, string> = {
  plot: "How good was the overall story of the show?",
  characters: "How compelling and likeable were the characters?",
  emotion:
    "Did the show successfully evoke an emotion? If it was a funny show, did you laugh? If it was a sad show, did you cry?",
  accessibility:
    "How good would this anime be for someone who has never watched an anime before?",
  audiovisual:
    "How good was the animation quality, voice acting, and sound design?",
  originality:
    "Was this anime creative or original enough to give it a unique charm?",
};

export default function DetailedScoreSelect({
  updateScore,
  defaultScores,
}: {
  updateScore: (scores: detailedScore) => void;
  defaultScores?: detailedScore;
}) {
  const [enabled, setEnabled] = useState(false);
  const [scores, setScores] = useState<detailedScore>(
    defaultScores || emptyScoreValues,
  );

  useEffect(() => {
    enabled ? updateScore(scores) : updateScore(emptyScoreValues);
  }, [scores, enabled, updateScore]);

  return (
    <div>
      <div className="flex w-full justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Detailed score</h2>
          <p className="text-sm text-foreground-500">
            Score the anime in different categories for a more detailed
            analysis.
          </p>
        </div>
        <Switch isSelected={enabled} onValueChange={setEnabled} />
      </div>
      {enabled && (
        <div className="flex flex-col gap-4">
          <div className="mt-4 grid grid-cols-1 gap-4">
            {Object.keys(scores).map((key: string) => (
              <Slider
                key={key}
                label={capitalize(key)}
                renderLabel={({ children, ...props }) => (
                  <label {...props}>
                    <div className="flex items-center gap-2 ">
                      <ChartIcon
                        className="text-primary"
                        name={categoriesToIcon[key]}
                      />{" "}
                      {children}
                    </div>
                  </label>
                )}
                maxValue={10}
                value={scores[key]}
                onChange={(value) =>
                  setScores({ ...scores, [key]: Number(value) })
                }
                classNames={{ label: "text-base", value: "text-base" }}
                startContent={
                  <Minus
                    className="text-foreground-500"
                    onClick={() =>
                      setScores({
                        ...scores,
                        [key]: Math.max(0, scores[key] - 1),
                      })
                    }
                  />
                }
                endContent={
                  <Plus
                    className="text-foreground-500"
                    onClick={() =>
                      setScores({
                        ...scores,
                        [key]: Math.min(10, scores[key] + 1),
                      })
                    }
                  />
                }
              />
            ))}
          </div>
          <Accordion
            variant="bordered"
            itemClasses={{ title: "italic text-foreground-500 text-base" }}
          >
            <AccordionItem key={1} title={"What are these categories?"}>
              <p className="text-foreground-500">
                Detailed scores are a way to rate an anime in a much more
                nuanced way than a standard 1-10 scale. There are 6 categories
                you can rate the anime in.
              </p>
              <ul className="my-4 grid grid-cols-1 gap-2">
                {Object.keys(scores).map((key: string) => (
                  <li key={key} className="flex gap-2">
                    <ChartIcon
                      className="m-2 min-w-max text-primary"
                      name={categoriesToIcon[key]}
                    />
                    <p className="grow text-foreground-500">
                      <span className="text-foreground">
                        {capitalize(key)}:
                      </span>{" "}
                      {categoryDescriptions[key]}
                    </p>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
          <ChartIcon name="plot" />
          <div className="my-4 flex justify-center">
            <RadarChart
              data={scores}
              pressable={false}
              size={250}
              iconSize={16}
            />
          </div>
        </div>
      )}
    </div>
  );
}

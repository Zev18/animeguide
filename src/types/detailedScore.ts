export type detailedScore = {
  plot: number;
  characters: number;
  emotion: number;
  accessibility: number;
  audiovisual: number;
  originality: number;
} & {
  [key: string]: number;
};

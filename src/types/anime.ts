export type anime = {
  id: number;
  title: string;
  mainPicture: {
    medium: string;
    large: string;
  };
  order: number;
  dateAdded: string;
  avgScore?: number;
  mean: number;
};

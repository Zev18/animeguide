export interface ListAnime {
  node: {
    title: string;
    id: number;
    main_picture: {
      medium: string;
      large: string;
    };
  };
  list_status: {
    status: string;
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
    updated_at: string;
  };
}

export default interface UserAnimeList {
  data: ListAnime[];
  paging: {
    next?: string;
    previous?: string;
  };
}

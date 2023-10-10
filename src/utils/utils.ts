import User from "@/types/user";
import _ from "lodash";

/**
 * Converts the keys of an object to camel case recursively.
 *
 * @param {Record<string, any> | User | undefined} obj - The object to camelize.
 * @return {Record<string, any>} The object with camel-cased keys.
 */
export const camelize = (
  obj: Record<string, any> | User | undefined,
): Record<string, any> => {
  if (!obj) return {};
  return _.transform(obj, (acc, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    acc[camelKey] = _.isObject(value) ? camelize(value) : value;
  });
};

export const hiRes = (size: number, url: string) => {
  return url.replace(/=s96-c$/, `=s${size}`);
};

/**
 * Converts a timestamp string into a formatted date string.
 *
 * @param {string} timestamp - The timestamp string to convert.
 * @return {string} The formatted date string.
 */
export const timestampToDate = (timestamp: string): string => {
  const date = new Date(timestamp);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
};

export const malUrl = (malId: string): string => {
  return `https://myanimelist.net/profile/${malId}`;
};

type animeStatus =
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped"
  | "plan_to_watch";
type animeListSort =
  | "list_score"
  | "list_updated_at"
  | "anime_title"
  | "anime_start_date";

/**
 * Retrieves a list of anime from MyAnimeList API based on the provided parameters.
 *
 * @param {string} malId - The MyAnimeList user ID.
 * @param {number} [limit] - The maximum number of anime to retrieve.
 * @param {number} [offset] - The offset for pagination.
 * @param {animeStatus} [status] - The status of the anime in the user's list.
 * @param {animeListSort} [sort] - The sorting criteria for the retrieved anime.
 * @return {Promise<any>} - A promise that resolves to the retrieved anime data or an error.
 */
export const getMalList = async (
  malId: string,
  limit?: number,
  offset?: number,
  status?: animeStatus,
  sort?: animeListSort,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application.json",
    "X-MAL-CLIENT-ID": process.env.NEXT_PUBLIC_MAL_CLIENT_ID!,
  };

  const url = new URL(
    `https://api.myanimelist.net/v2/users/${malId}/animelist`,
  );
  url.searchParams.set("fields", "list_status");

  if (limit) {
    url.searchParams.set("limit", limit.toString());
  }
  if (offset) {
    url.searchParams.set("offset", offset.toString());
  }
  if (status) {
    url.searchParams.set("status", status);
  }
  if (sort) {
    url.searchParams.set("sort", sort);
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("User not found");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Retrieves details of an anime from the MyAnimeList API.
 *
 * @param {number} animeId - The ID of the anime to retrieve details for.
 * @return {Promise<any>} - A Promise that resolves to the details of the anime.
 */
export const getAnimeDetails = async (animeId: number) => {
  const headers: HeadersInit = {
    "Content-Type": "application.json",
    "X-MAL-CLIENT-ID": process.env.NEXT_PUBLIC_MAL_CLIENT_ID!,
  };

  const url = new URL(`https://api.myanimelist.net/v2/anime/${animeId}`);
  url.searchParams.set("fields", "main_picture,title");

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Anime not found");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

/**
 * Calculates the average value of an array of numbers.
 *
 * @param {number[]} data - The array of numbers to calculate the average from.
 * @param {number} [places] - The number of decimal places to round the average to.
 * @return {number} The average value of the array.
 */
export const getAverage = (data: number[], places: number = 1) => {
  const sum = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const average = sum / data.length;

  return average.toFixed(places);
};

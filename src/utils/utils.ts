import User from "@/types/user";
import _ from "lodash";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const headers: HeadersInit = {
  "Content-Type": "application.json",
  "X-MAL-CLIENT-ID": process.env.NEXT_PUBLIC_MAL_CLIENT_ID!,
};

// to generate supabase types: supabase gen types typescript --project-id sgncomrfzmsccjmvvfpv > database.types.ts

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

export type animeStatus =
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped"
  | "plan_to_watch";
export type animeListSort =
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
export const getAnimeDetails = async (animeId: number, fields?: string) => {
  const url = new URL(`https://api.myanimelist.net/v2/anime/${animeId}`);
  let fieldString = "main_picture,title";

  fields ? (fieldString += "," + fields) : fieldString;

  url.searchParams.set("fields", fieldString);

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
 * Searches for anime based on the provided query.
 *
 * @param {string} query - The search query.
 * @param {number} limit - The number of results to return. Default is 5.
 * @param {number} offset - The offset for pagination. Default is 0.
 * @param {string} fields - Optional fields to include in the response.
 * @return {Promise<any>} A promise that resolves to the search results.
 */
export const searchAnime = async (
  query: string,
  limit: number = 5,
  offset: number = 0,
  fields?: string,
) => {
  const url = new URL("https://api.myanimelist.net/v2/anime");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", limit.toString());
  url.searchParams.set("offset", offset.toString());
  if (fields) {
    url.searchParams.set("fields", fields);
  }
  console.log(url);

  try {
    if (query.length < 3) {
      throw new Error("Query must be at least 3 characters long.");
    }
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error("Error searching animes");
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

/**
 * Retrieves the details of an anime from the MAL API for use in client-side components.
 *
 * @param {number} animeId - The ID of the anime to retrieve details for.
 * @return {Promise<any>} A promise that resolves to the details of the anime.
 */
export const getAnimeDetailsClient = async (animeId: number) => {
  const url = `/api/mal/anime?id=${animeId}`;
  const res = await fetch(url);
  return await res.json();
};

/**
 * Retrieves the MAL list client for a specific MAL ID for use in client-side components.
 *
 * @param {string} malId - The MAL ID of the user.
 * @param {number} [limit] - The maximum number of items to retrieve.
 * @param {number} [offset] - The offset of the items to retrieve.
 * @param {animeStatus} [status] - The status of the anime list.
 * @param {animeListSort} [sort] - The sorting order of the anime list.
 * @return {Promise<any>} - A promise that resolves to the MAL list client.
 */
export const getMalListClient = async (
  malId: string,
  limit?: number,
  offset?: number,
  status?: animeStatus,
  sort?: animeListSort,
) => {
  const url = "/api/mal/userlist";
  const params = new URLSearchParams();
  params.append("malId", malId);
  if (limit) params.append("limit", limit.toString());
  if (offset) params.append("offset", offset.toString());
  if (status) params.append("status", status.toString());
  if (sort) params.append("sort", sort.toString());

  const res = await fetch(url);
  return await res.json();
};

/**
 * Asynchronous function to search for anime using the given query, limit, offset, and fields.
 *
 * @param {string} query - The search query for anime
 * @param {number} [limit] - The maximum number of results to return
 * @param {number} [offset] - The number of results to skip
 * @param {string} [fields] - The fields to sort the results by
 * @return {Promise<any>} A promise that resolves with the search results
 */
export const searchAnimeClient = async (
  query: string,
  limit?: number,
  offset?: number,
  fields?: string,
) => {
  const url = "/api/mal/search";
  const params = new URLSearchParams();
  params.append("query", query);
  if (limit) params.append("limit", limit.toString());
  if (offset) params.append("offset", offset.toString());
  if (fields) params.append("fields", fields);

  const res = await fetch(url + "?" + params);
  return await res.json();
};

export const formatDatePg = (date: Date): string => {
  const isoString = date.toISOString();
  // Format the string as required by PostgreSQL
  const postgresTimestampTZ = isoString
    .replace("T", " ")
    .replace("Z", "+00:00");
  return postgresTimestampTZ;
};

/**
 * Generates a pagination object based on the given page and size parameters.
 *
 * @param {number} page - The current page number.
 * @param {number} size - The number of items per page.
 * @return {Object} An object containing the starting and ending indices of the pagination range.
 */
export const getPagination = (page: number | null, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

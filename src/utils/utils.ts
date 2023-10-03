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

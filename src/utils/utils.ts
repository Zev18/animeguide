import _ from "lodash";

/**
 * Converts the keys of an object to camel case recursively.
 *
 * @param {Record<string, any> | undefined} obj - The object to camelize.
 * @return {Record<string, any>} The object with camel-cased keys.
 */
export const camelize = (
  obj: Record<string, any> | undefined,
): Record<string, any> => {
  if (!obj) return {};
  return _.transform(obj, (acc, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    acc[camelKey] = _.isObject(value) ? camelize(value) : value;
  });
};

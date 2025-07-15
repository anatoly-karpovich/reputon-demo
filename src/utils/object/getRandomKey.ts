import _ from "lodash";

/**
 * Returns a random key from the given object, excluding the given except key if provided.
 * @param object The object to get a random key from.
 * @param except The key to exclude from the random selection.
 * @returns A random key from the given object.
 */
export function getRandomKey<T extends object>(object: T, except?: keyof T | (keyof T)[]) {
  const actualObject = except ? _.omit(object, except) : object;
  const key = Object.keys(actualObject)[Math.floor(Math.random() * Object.keys(actualObject).length)];

  return key as keyof T;
}

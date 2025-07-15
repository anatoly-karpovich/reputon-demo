/**
 * Finds the key in an object that corresponds to a specified value.
 *
 * @param object - The object to search within.
 * @param value - The value to find the corresponding key for.
 * @returns The key of the property with the given value, or undefined if not found.
 */
export function findKeyByValue<T extends object>(object: T, value: T[keyof T]) {
  return (Object.keys(object) as (keyof T)[]).find((key) => object[key] === value) as keyof T;
}

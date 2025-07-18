/**
 * Gets elements from an array starting from a given index and takes a specified number of elements.
 * If the number of elements exceeds the array length, it will loop back to the start of the array.
 *
 * @param array - The array to get elements from
 * @param startIndex - The index to start getting elements from
 * @param numberOfElements - The number of elements to get
 * @returns An array of elements from the original array, starting from the specified index and taking the specified number of elements
 */
export function getElementsFromIndex<T>(array: T[], startIndex: number, numberOfElements: number): T[] {
  if (numberOfElements <= 0) {
    return [];
  }
  if (numberOfElements >= array.length) {
    return array;
  }
  const lastIndex = array.length - 1;
  const result: T[] = [];
  for (let i = startIndex; i < startIndex + numberOfElements; i++) {
    if (i > lastIndex) {
      result.push(array[i - lastIndex - 1]);
    } else {
      result.push(array[i]);
    }
  }
  return result;
}

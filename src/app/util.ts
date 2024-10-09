export function arrayUp<T>(array: T[], element: T) {
  const index = array.indexOf(element);

  if (index > 0) {
    [array[index], array[index - 1]] = [array[index - 1], array[index]];
  }
}

export function arrayDown<T>(array: T[], element: T) {
  const index = array.indexOf(element);

  if (index >= 0 && index < array.length - 1) {
    [array[index], array[index + 1]] = [array[index + 1], array[index]];
  }
}

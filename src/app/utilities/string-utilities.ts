const defaultRandomStringLength = 12

export const getRansomString = (length = defaultRandomStringLength): string =>
  Math.random().toString(16).substring(2, length)

export const getRansomStringFromObject = (
  object: Record<string, object>,
  length = defaultRandomStringLength,
) => {
  let id = getRansomString(length)
  while (object[id]) {
    id = getRansomString(length)
  }
  return id
}

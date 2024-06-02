export const getRansomString = (length = 12): string => {
  return Math.random().toString(16).substring(2, length)
}

export const getRansomStringFromObject = (
  object: { [id: string]: object },
  length = 12,
) => {
  let id = getRansomString(length)
  while (object[id]) {
    id = getRansomString(length)
  }
  return id
}

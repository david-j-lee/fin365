export const localStorageService = {
  getObject: <Type>(key: string): Record<string, Type> =>
    JSON.parse(localStorage.getItem(key) ?? '{}'),
  setObject: (key: string, object: object) => {
    localStorage.setItem(key, JSON.stringify(object))
  },
}

export const localStorageService = {
  getObject: <Type>(key: string): { [id: string]: Type } =>
    JSON.parse(localStorage.getItem(key) ?? '{}'),
  setObject: (key: string, object: object) => {
    localStorage.setItem(key, JSON.stringify(object))
  },
}

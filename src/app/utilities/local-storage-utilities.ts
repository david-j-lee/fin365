export const localStorageService = {
  getObject: (key: string) => {
    return JSON.parse(localStorage.getItem(key) ?? '{}')
  },
  setObject: (key: string, object: object) => {
    localStorage.setItem(key, JSON.stringify(object))
  },
}

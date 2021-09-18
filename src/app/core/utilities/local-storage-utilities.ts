export const sessionStorageService = {
  getObject: (key: string) => {
    return JSON.parse(localStorage.getItem(key) ?? '{}');
  },
  setObject: (key: string, object: Object) => {
    localStorage.setItem(key, JSON.stringify(object));
  },
};

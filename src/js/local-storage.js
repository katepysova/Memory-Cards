export default class LocalStorage {
  static setItem(key, item) {
    const stringifiedItem = JSON.stringify(item);
    localStorage.setItem(key, stringifiedItem);
  }

  static getItem(key) {
    const retrievedItem = localStorage.getItem(key);
    return JSON.parse(retrievedItem);
  }

  static removeItem(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

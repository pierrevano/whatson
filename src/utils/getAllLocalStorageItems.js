import localStorageItems from "./localStorageItems";

/**
 * Retrieves specified items from local storage based on provided keys.
 * @returns {Object} An object containing specified local storage items.
 */
const getAllLocalStorageItems = () => {
  const items = {};

  Object.keys(localStorageItems).forEach((key) => {
    items[key] = localStorage.getItem(key);
  });

  return items;
};

export default getAllLocalStorageItems;

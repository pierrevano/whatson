import createStorage from "context-storage";
import { useAuth0 } from "@auth0/auth0-react";
import getAllLocalStorageItems from "./getAllLocalStorageItems";
import postPreferences from "./postPreferences";

/**
 * Creates a storage provider and hook for managing a set of favorites.
 * @returns {[Provider, useStorage]} - A tuple containing the storage provider and the useStorage hook.
 */
const [Provider, useStorage] = createStorage(
  "favorites",
  new Set(),
  (key, value) =>
    key === "" && value === null
      ? new Set()
      : Array.isArray(value)
        ? new Set(value)
        : value,
  (key, value) => (value instanceof Set ? [...value].sort() : value),
);

const useFavorites = () => {
  const [value, setValue] = useStorage();

  const { isAuthenticated, user } = useAuth0();

  const synchronizePreferences = (newValue) => {
    if (isAuthenticated && user) {
      const preferences = {
        ...getAllLocalStorageItems(),
        favorites: JSON.stringify([...newValue]),
      };
      postPreferences(preferences, user);
    }
  };

  const add = (item) => {
    const newValue = new Set(value).add(item);
    setValue(newValue);
    synchronizePreferences(newValue);
  };

  const addMany = (items) => {
    if (!items) {
      return;
    }

    const entries = Array.isArray(items)
      ? items
      : items instanceof Set
        ? [...items]
        : [];

    if (!entries.length) {
      return;
    }

    const newValue = new Set(value);
    let hasChanges = false;

    entries.forEach((entry) => {
      if (typeof entry !== "string" && typeof entry !== "number") {
        return;
      }

      const normalized = `${entry}`.trim();

      if (!normalized || newValue.has(normalized)) {
        return;
      }

      newValue.add(normalized);
      hasChanges = true;
    });

    if (!hasChanges) {
      return;
    }

    setValue(newValue);
    synchronizePreferences(newValue);
  };

  const remove = (item) => {
    const newValue = new Set(value);
    newValue.delete(item);
    setValue(newValue);
    synchronizePreferences(newValue);
  };

  const toggle = (item) => {
    value.has(item) ? remove(item) : add(item);
  };

  return [value, { add, addMany, remove, toggle }];
};

const useFavoriteState = (item) => {
  const [value, { add, remove, toggle }] = useFavorites();
  const i = item;

  const actions = {
    add: () => add(i),
    remove: () => remove(i),
    toggle: () => toggle(i),
  };

  return [value.has(i), actions];
};

export { useFavorites, useFavoriteState, Provider };

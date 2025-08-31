import { atom, getDefaultStore } from "jotai";
import db, { subscribeDB } from "./libs/db";
import { atomWithRefresh } from "jotai/utils";
import { startViewTransition } from "./libs/ui";

// Jotai store for external updates
const store = getDefaultStore();
subscribeDB("appsChanged", () => {
  startViewTransition(() => {
    store.set(appsAtom);
  });
});
subscribeDB("categoriesChanged", () => {
  startViewTransition(() => {
    store.set(categoriesAtom);
  });
});

export const appsAtom = atomWithRefresh(async () => {
  try {
    const apps = await db.selectFrom("apps").selectAll().execute();
    return apps;
  } catch (error) {
    console.warn("Handled error: ", error);
    return [];
  }
});

export const categoriesAtom = atomWithRefresh(async () => {
  try {
    const categories = await db.selectFrom("categories").selectAll().execute();
    return categories;
  } catch (error) {
    console.warn("Handled error: ", error);
    return [];
  }
});

export const selectedCategoryIndexAtom = atom(0);

export const selectedCategoryAtom = atom(async (get) => {
  const categories = await get(categoriesAtom);
  const selectedCategoryIndex = get(selectedCategoryIndexAtom);
  const selectedCategory = categories[selectedCategoryIndex] ?? categories[0];
  if (!selectedCategory) {
    return undefined;
  }
  return selectedCategory;
});

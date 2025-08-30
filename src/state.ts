import { atom } from "jotai";
import type { DummyApp } from "./types";

const dummyApps: DummyApp[] = [
  { id: 1, name: "app-one", description: "first dummy app." },
  { id: 2, name: "app-two", description: "second dummy app." },
  { id: 3, name: "app-three", description: "third dummy app." },
];

export const dummyAppAtom = atom<DummyApp[]>(dummyApps);
export type DummyAppAtom = typeof dummyAppAtom;

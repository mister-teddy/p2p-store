import type { Kysely, Selectable } from "kysely";
import type React from "react";

export type SqlValue = string | number | boolean | null;

export type QueryExecResult = {
  columns: string[];
  values: SqlValue[][];
};

export interface AppTable {
  id: string;
  name: string;
  description: string;
  icon: string;
  price?: number;
  version?: string;
  installed: number;
}

export interface DB {
  apps: AppTable;
}

export type AppProps<T> = {
  db: Kysely<T>;
  app: Selectable<AppTable>;
  React: typeof React;
};

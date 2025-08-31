import type { Generated, Kysely, Selectable } from "kysely";

export type SqlValue = string | number | boolean | null;

export type QueryExecResult = {
  columns: string[];
  values: SqlValue[][];
};

export interface AppTable {
  id: Generated<number>;
  name: string;
  description: string;
  icon: string;
  price?: number;
  version?: string;
  entry?: string;
}

export interface CategoryTable {
  id: Generated<number>;
  label: string;
  icon: string;
}

export interface DB {
  apps: AppTable;
  categories: CategoryTable;
}

export type AppProps<T> = {
  db: Kysely<T>;
  app: Selectable<AppTable>;
};

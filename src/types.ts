import { type Generated, type Selectable } from "kysely";

export type SqlValue = string | number | boolean | null;

export type QueryExecResult = {
  columns: string[];
  values: SqlValue[][];
};

// Kysely Schema
export interface AppTable {
  id: Generated<number>;
  name: string;
  description: string;
}

export interface DB {
  apps: AppTable;
}

export type App = Selectable<AppTable>;

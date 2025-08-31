export type SqlValue = string | number | boolean | null;

export type QueryExecResult = {
  columns: string[];
  values: SqlValue[][];
};

export type App = {
  id: number;
  name: string;
  description: string;
  icon: string;
  price?: number;
  version?: string;
};

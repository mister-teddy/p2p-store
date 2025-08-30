import { atom } from "jotai";
import type { DB } from "./types";

import { SQLocalKysely } from "sqlocal/kysely";
import { Kysely } from "kysely";

// Initialize SQLocalKysely and pass the dialect to Kysely
const { dialect } = new SQLocalKysely("database.sqlite3");
const db = new Kysely<DB>({ dialect });
db.schema
  .createTable("apps")
  .ifNotExists()
  .addColumn("id", "integer", (col) => col.primaryKey())
  .addColumn("name", "text")
  .addColumn("description", "text")
  .execute();

export const appAtom = atom(async () => {
  const apps = await db
    .selectFrom("apps")
    .select(["id", "name", "description"])
    .orderBy("name", "asc")
    .execute();

  console.log({ apps });

  return apps;
});

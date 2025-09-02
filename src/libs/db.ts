import { SQLocalKysely } from "sqlocal/kysely";
import { Kysely } from "kysely";
import type { DB } from "@/types";

// Simple event emitter for pub/sub
type DBEvent = "appsChanged" | "categoriesChanged";
type Listener = () => void;
const listeners: Record<DBEvent, Listener[]> = {
  appsChanged: [],
  categoriesChanged: [],
};

export function subscribeDB(event: DBEvent, listener: Listener) {
  listeners[event].push(listener);
  return () => {
    listeners[event] = listeners[event].filter((l) => l !== listener);
  };
}

function publishDB(event: DBEvent) {
  listeners[event].forEach((listener) => listener());
}

// Initialize SQLocalKysely and pass the dialect to Kysely
const { dialect } = new SQLocalKysely("database.sqlite3");
const db = new Kysely<DB>({ dialect });

db.schema
  .createTable("categories")
  .ifNotExists()
  .addColumn("id", "integer", (col) => col.primaryKey())
  .addColumn("label", "text")
  .addColumn("icon", "text")
  .execute()
  .then(async () => {
    const { count } = await db
      .selectFrom("categories")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirstOrThrow();

    if (Number(count) === 0) {
      await db
        .insertInto("categories")
        .values([
          { label: "Discover", icon: "⭐" },
          { label: "Arcade", icon: "🕹️" },
          { label: "Create", icon: "✏️" },
          { label: "Work", icon: "💼" },
          { label: "Play", icon: "🎮" },
          { label: "Develop", icon: "🛠️" },
          { label: "Updates", icon: "🔄" },
        ])
        .execute();
      publishDB("categoriesChanged");
    }
  });

db.schema
  .createTable("apps")
  .ifNotExists()
  .addColumn("id", "text", (col) => col.primaryKey())
  .addColumn("name", "text")
  .addColumn("description", "text")
  .addColumn("version", "text")
  .addColumn("price", "real")
  .addColumn("icon", "text")
  .execute()
  .then(async () => {
    const randomVersion = () =>
      `${Math.floor(Math.random() * 3) + 1}.${Math.floor(
        Math.random() * 10
      )}.${Math.floor(Math.random() * 10)}`;
    const randomPrice = () => Number((Math.random() * 9.99).toFixed(2));

    const { count } = await db
      .selectFrom("apps")
      .select(db.fn.count("id").as("count"))
      .executeTakeFirstOrThrow();

    if (Number(count) === 0) {
      await db
        .insertInto("apps")
        .values([
          {
            id: "notepad",
            name: "Notepad",
            description: "A simple notepad for quick notes and ideas.",
            version: randomVersion(),
            price: 0,
            icon: "📝",
          },
          {
            id: "to-do-list",
            name: "To-Do List",
            description: "Manage your tasks and stay organized.",
            version: randomVersion(),
            price: randomPrice(),
            icon: "✅",
          },
          {
            id: "calendar",
            name: "Calendar",
            description: "View and schedule your events easily.",
            version: randomVersion(),
            price: randomPrice(),
            icon: "📅",
          },
          {
            id: "chess",
            name: "Chess",
            description: "Play chess and challenge your mind.",
            version: randomVersion(),
            price: randomPrice(),
            icon: "♟️",
          },
          {
            id: "file-drive",
            name: "File Drive",
            description: "Store and access your files securely.",
            version: randomVersion(),
            price: randomPrice(),
            icon: "🗂️",
          },
          {
            id: "calculator",
            name: "Calculator",
            description: "Perform quick calculations and solve equations.",
            version: randomVersion(),
            price: randomPrice(),
            icon: "🧮",
          },
          {
            id: "stocks",
            name: "Stocks",
            description: "Track stock prices and market trends.",
            version: randomVersion(),
            price: randomPrice(),
            icon: "📈",
          },
        ])
        .execute();
      publishDB("appsChanged");
    }
  });

export default db;
// Only export subscribeDB and publishDB once

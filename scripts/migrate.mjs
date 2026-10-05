#!/usr/bin/env node
/**
 * Applies db/migrations/*.sql in order against DATABASE_URL.
 * Tracks what has run in a schema_migrations table so it is safe to re-run.
 */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(root, "db", "migrations");

const url = process.env.DATABASE_URL || process.env.DATABASE_URL_POOLED;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const sql = neon(url);
await sql`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`;
const done = new Set((await sql`select name from schema_migrations`).map((r) => r.name));

const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
for (const file of files) {
  if (done.has(file)) {
    console.log(`skip  ${file}`);
    continue;
  }
  const text = await readFile(path.join(dir, file), "utf8");
  const statements = text
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await sql.query(statement);
  }
  await sql`insert into schema_migrations (name) values (${file})`;
  console.log(`apply ${file}`);
}
console.log("migrations up to date");

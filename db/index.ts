import { drizzle } from "drizzle-orm/vercel-postgres";
import { config } from "dotenv";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

config({ path: ".env" }); // or .env

// export const db = drizzle();
export const db = drizzle(sql, { schema });

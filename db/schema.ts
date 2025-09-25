import {
  pgTableCreator,
  serial,
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

const createTable = pgTableCreator((name) => `survivor_${name}`);

// Pool participants (people who drew names)
export const players = createTable("player", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  // meta
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

// Survivor seasons
export const seasons = createTable("season", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Survivor 45: Island of the Idols"
  seasonNumber: integer("season_number").notNull(),
  location: varchar("location", { length: 100 }), // e.g., "Fiji", "Cambodia"
  startDate: date("start_date"),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true),
  // meta
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

// Survivor cast members
export const castMembers = createTable("cast_member", {
  id: serial("id").primaryKey(),
  seasonId: integer("season_id")
    .references(() => seasons.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age"),
  occupation: varchar("occupation", { length: 150 }),
  hometown: varchar("hometown", { length: 100 }),
  tribe: varchar("tribe", { length: 50 }), // Initial tribe name
  isStillInGame: boolean("is_still_in_game").default(true),
  placementOrder: integer("placement_order"), // 1 = winner, 2 = runner-up, etc.
  votedOffDay: integer("voted_off_day"), // Day number when eliminated
  votedOffDate: date("voted_off_date"),
  eliminationReason: varchar("elimination_reason", { length: 50 }), // 'voted_out', 'quit', 'medevac', 'ejected'
  // meta
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
});

// Pool picks - which cast member each player drew
export const poolPicks = createTable("pool_pick", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id")
    .references(() => players.id, { onDelete: "cascade" })
    .notNull(),
  castMemberId: integer("cast_member_id")
    .references(() => castMembers.id, { onDelete: "cascade" })
    .notNull(),
  seasonId: integer("season_id")
    .references(() => seasons.id, { onDelete: "cascade" })
    .notNull(),
  // meta
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Relations
export const playerRelations = relations(players, ({ many }) => ({
  poolPicks: many(poolPicks),
}));

export const seasonRelations = relations(seasons, ({ many }) => ({
  castMembers: many(castMembers),
  poolPicks: many(poolPicks),
}));

export const castMemberRelations = relations(castMembers, ({ one, many }) => ({
  season: one(seasons, {
    fields: [castMembers.seasonId],
    references: [seasons.id],
  }),
  poolPicks: many(poolPicks),
}));

export const poolPickRelations = relations(poolPicks, ({ one }) => ({
  player: one(players, {
    fields: [poolPicks.playerId],
    references: [players.id],
  }),
  castMember: one(castMembers, {
    fields: [poolPicks.castMemberId],
    references: [castMembers.id],
  }),
  season: one(seasons, {
    fields: [poolPicks.seasonId],
    references: [seasons.id],
  }),
}));

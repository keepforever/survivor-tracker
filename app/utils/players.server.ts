import { db } from "db";
import { players } from "db/schema";
import { eq } from "drizzle-orm";

export type NewPlayerPayload = typeof players.$inferInsert;
export type UpdatePlayerPayload = { id: number; name?: string; email?: string };

export const insertPlayer = async (payload: NewPlayerPayload) => {
  const { name, email } = payload;
  return await db
    .insert(players)
    .values({ name, email })
    .returning({ id: players.id, name: players.name });
};

export const getPlayer = async (id: number) => {
  return await db.query.players.findFirst({
    where: eq(players.id, id),
  });
};

export const getPlayerWithPicks = async (id: number) => {
  return await db.query.players.findFirst({
    where: eq(players.id, id),
    with: {
      poolPicks: {
        with: {
          castMember: true,
          season: true,
        },
      },
    },
  });
};

export const deletePlayer = async (id: number) => {
  return await db.delete(players).where(eq(players.id, id));
};

export const updatePlayer = async (payload: UpdatePlayerPayload) => {
  const { id, ...updates } = payload;
  return await db
    .update(players)
    .set(updates)
    .where(eq(players.id, id))
    .returning({ id: players.id, name: players.name });
};

export const getAllPlayers = async () => {
  return await db.query.players.findMany();
};

export const getPlayerByEmail = async (email: string) => {
  return await db.query.players.findFirst({
    where: eq(players.email, email),
  });
};

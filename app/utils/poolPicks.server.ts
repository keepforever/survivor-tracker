import { db } from "db";
import { poolPicks, castMembers } from "db/schema";
import { eq, and } from "drizzle-orm";

export type NewPoolPickPayload = typeof poolPicks.$inferInsert;

export const insertPoolPick = async (payload: NewPoolPickPayload) => {
  const { playerId, castMemberId, seasonId } = payload;
  return await db
    .insert(poolPicks)
    .values({ playerId, castMemberId, seasonId })
    .returning({ id: poolPicks.id });
};

export const getPoolPick = async (id: number) => {
  return await db.query.poolPicks.findFirst({
    where: eq(poolPicks.id, id),
  });
};

export const getPoolPickWithDetails = async (id: number) => {
  return await db.query.poolPicks.findFirst({
    where: eq(poolPicks.id, id),
    with: {
      player: true,
      castMember: true,
      season: true,
    },
  });
};

export const deletePoolPick = async (id: number) => {
  return await db.delete(poolPicks).where(eq(poolPicks.id, id));
};

export const getAllPoolPicks = async () => {
  return await db.query.poolPicks.findMany({
    with: {
      player: true,
      castMember: true,
      season: true,
    },
  });
};

export const getPoolPicksBySeason = async (seasonId: number) => {
  return await db.query.poolPicks.findMany({
    where: eq(poolPicks.seasonId, seasonId),
    with: {
      player: true,
      castMember: true,
    },
    orderBy: (poolPicks, { asc }) => [asc(poolPicks.playerId)],
  });
};

export const getPoolPicksByPlayer = async (playerId: number) => {
  return await db.query.poolPicks.findMany({
    where: eq(poolPicks.playerId, playerId),
    with: {
      castMember: true,
      season: true,
    },
    orderBy: (poolPicks, { desc }) => [desc(poolPicks.seasonId)],
  });
};

export const getPlayerPickForSeason = async (
  playerId: number,
  seasonId: number
) => {
  return await db.query.poolPicks.findFirst({
    where: and(
      eq(poolPicks.playerId, playerId),
      eq(poolPicks.seasonId, seasonId)
    ),
    with: {
      castMember: true,
      season: true,
    },
  });
};

export const getCastMemberPicker = async (castMemberId: number) => {
  return await db.query.poolPicks.findFirst({
    where: eq(poolPicks.castMemberId, castMemberId),
    with: {
      player: true,
      season: true,
    },
  });
};

export const getActivePicksBySeason = async (seasonId: number) => {
  const picks = await db.query.poolPicks.findMany({
    where: eq(poolPicks.seasonId, seasonId),
    with: {
      player: true,
      castMember: true,
    },
  });

  return picks.filter(pick => pick.castMember?.isStillInGame === true);
};

export const getEliminatedPicksBySeason = async (seasonId: number) => {
  const picks = await db.query.poolPicks.findMany({
    where: eq(poolPicks.seasonId, seasonId),
    with: {
      player: true,
      castMember: true,
    },
  });

  return picks.filter(pick => pick.castMember?.isStillInGame === false);
};

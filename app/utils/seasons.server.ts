import { db } from "db";
import { seasons } from "db/schema";
import { eq } from "drizzle-orm";

export type NewSeasonPayload = typeof seasons.$inferInsert
export type UpdateSeasonPayload = {
  id: number
  name?: string
  seasonNumber?: number
  location?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
}

export const insertSeason = async (payload: NewSeasonPayload) => {
  const { name, seasonNumber, location, startDate, endDate, isActive } = payload
  return await db
    .insert(seasons)
    .values({ name, seasonNumber, location, startDate, endDate, isActive })
    .returning({ id: seasons.id, name: seasons.name, seasonNumber: seasons.seasonNumber })
}

export const getSeason = async (id: number) => {
  return await db.query.seasons.findFirst({
    where: eq(seasons.id, id),
  })
}

export const getSeasonWithCastAndPicks = async (id: number) => {
  return await db.query.seasons.findFirst({
    where: eq(seasons.id, id),
    with: {
      castMembers: true,
      poolPicks: {
        with: {
          player: true,
          castMember: true,
        },
      },
    },
  })
}

export const deleteSeason = async (id: number) => {
  return await db.delete(seasons).where(eq(seasons.id, id))
}

export const updateSeason = async (payload: UpdateSeasonPayload) => {
  const { id, ...updates } = payload
  return await db
    .update(seasons)
    .set(updates)
    .where(eq(seasons.id, id))
    .returning({ id: seasons.id, name: seasons.name, seasonNumber: seasons.seasonNumber })
}

export const getAllSeasons = async () => {
  return await db.query.seasons.findMany({
    orderBy: (seasons, { desc }) => [desc(seasons.seasonNumber)],
  })
}

export const getActiveSeason = async () => {
  return await db.query.seasons.findFirst({
    where: eq(seasons.isActive, true),
  })
}

export const getSeasonByNumber = async (seasonNumber: number) => {
  return await db.query.seasons.findFirst({
    where: eq(seasons.seasonNumber, seasonNumber),
  })
}
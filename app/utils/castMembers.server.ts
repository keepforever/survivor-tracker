import { db } from "db";
import { castMembers } from "db/schema";
import { eq, and } from "drizzle-orm";

export type NewCastMemberPayload = typeof castMembers.$inferInsert
export type UpdateCastMemberPayload = {
  id: number
  name?: string
  age?: number
  occupation?: string
  hometown?: string
  tribe?: string
  isStillInGame?: boolean
  placementOrder?: number
  votedOffDay?: number
  votedOffDate?: string
  eliminationReason?: string
}

export const insertCastMember = async (payload: NewCastMemberPayload) => {
  const { seasonId, name, age, occupation, hometown, tribe, isStillInGame } = payload
  return await db
    .insert(castMembers)
    .values({ seasonId, name, age, occupation, hometown, tribe, isStillInGame })
    .returning({ id: castMembers.id, name: castMembers.name })
}

export const getCastMember = async (id: number) => {
  return await db.query.castMembers.findFirst({
    where: eq(castMembers.id, id),
  })
}

export const getCastMemberWithDetails = async (id: number) => {
  return await db.query.castMembers.findFirst({
    where: eq(castMembers.id, id),
    with: {
      season: true,
      poolPicks: {
        with: {
          player: true,
        },
      },
    },
  })
}

export const deleteCastMember = async (id: number) => {
  return await db.delete(castMembers).where(eq(castMembers.id, id))
}

export const updateCastMember = async (payload: UpdateCastMemberPayload) => {
  const { id, ...updates } = payload
  return await db
    .update(castMembers)
    .set(updates)
    .where(eq(castMembers.id, id))
    .returning({ id: castMembers.id, name: castMembers.name, isStillInGame: castMembers.isStillInGame })
}

export const getAllCastMembers = async () => {
  return await db.query.castMembers.findMany()
}

export const getCastMembersBySeason = async (seasonId: number) => {
  return await db.query.castMembers.findMany({
    where: eq(castMembers.seasonId, seasonId),
    orderBy: (castMembers, { asc }) => [asc(castMembers.name)],
  })
}

export const getRemainingCastMembers = async (seasonId: number) => {
  return await db.query.castMembers.findMany({
    where: and(eq(castMembers.seasonId, seasonId), eq(castMembers.isStillInGame, true)),
    orderBy: (castMembers, { asc }) => [asc(castMembers.name)],
  })
}

export const getEliminatedCastMembers = async (seasonId: number) => {
  return await db.query.castMembers.findMany({
    where: and(eq(castMembers.seasonId, seasonId), eq(castMembers.isStillInGame, false)),
    orderBy: (castMembers, { asc }) => [asc(castMembers.placementOrder)],
  })
}

export const eliminateCastMember = async (
  id: number,
  eliminationData: {
    placementOrder: number
    votedOffDay?: number
    votedOffDate?: string
    eliminationReason: string
  }
) => {
  const { placementOrder, votedOffDay, votedOffDate, eliminationReason } = eliminationData
  return await db
    .update(castMembers)
    .set({
      isStillInGame: false,
      placementOrder,
      votedOffDay,
      votedOffDate,
      eliminationReason,
    })
    .where(eq(castMembers.id, id))
    .returning({ id: castMembers.id, name: castMembers.name, placementOrder: castMembers.placementOrder })
}
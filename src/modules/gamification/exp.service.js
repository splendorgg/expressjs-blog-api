import { prisma } from "#/config/prisma.js"
import { getRequiredXP } from "#/modules/gamification/level.service.js"
import { AppError } from "#/middleware/error.middleware.js"

export const XP_REWARDS = {
    TODO_COMPLETE: 10,
    HABIT_COMPLETE: 20,
    LOGIN: 10,
}

export async function grantXP(userId, event, streakBonus = true) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError("User not found")

    let baseXP = XP_REWARDS[event] || 10
    let finalXP = baseXP

    if (streakBonus && event === "LOGIN" && user.streak && user.streak > 1) {
        const multiplier = 1 + user.streak * 0.05
        finalXP = Math.round(baseXP * multiplier)
    }

    let totalXP = user.exp + finalXP
    let level = user.level
    let requiredXP = getRequiredXP(level)

    while (totalXP >= requiredXP) {
        totalXP -= requiredXP
        level++
        requiredXP = getRequiredXP(level)
    }

    return prisma.user.update({
        where: { id: userId },
        data: {
            exp: totalXP,
            level: level
        }
    })
}
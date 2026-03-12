import { prisma } from "#/config/prisma.js"
import { getRequiredXP } from "#/modules/gamification/level.service.js"
import { XP_REWARDS } from "#/modules/gamification/xp.events.js"

export async function grantXP(userId, event) {

    const reward = XP_REWARDS[event]
    if (!reward) return

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    let xp = user.exp + reward
    let level = user.level

    let requiredXP = getRequiredXP(level)

    while (xp >= requiredXP) {
        xp -= requiredXP
        level++
        requiredXP = getRequiredXP(level)
    }

    return prisma.user.update({
        where: { id: userId },
        data: {
            exp: xp,
            level: level
        }
    })
}
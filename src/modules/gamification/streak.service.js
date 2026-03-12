import { prisma } from "#/config/prisma.js"

function getDayDifference(date1, date2) {
    const oneDay = 1000 * 60 * 60 * 24
    const d1 = new Date(date1).setHours(0, 0, 0, 0)
    const d2 = new Date(date2).setHours(0, 0, 0, 0)
    return Math.floor((d2 - d1) / oneDay)
}

export async function updateStreak(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    const today = new Date()

    if (!user.lastLogin) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                streak: 1,
                lastLogin: today
            }
        })
    }

    const diff = getDayDifference(user.lastLogin, today)

    if (diff === 0) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                lastLogin: today
            }
        });
    }

    const newStreak = diff === 1 ? user.streak + 1 : 1;

    return prisma.user.update({
        where: { id: userId },
        data: {
            streak: newStreak,
            lastLogin: today
        }
    });
}
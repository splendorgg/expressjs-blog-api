import { AppError } from "#/middleware/error.middleware.js"
import { prisma } from "#/config/prisma.js"


export async function getUserByKeycloakId(keycloakId) {
    const user = await prisma.user.findUnique({
        where: { keycloakId }
    })
    if (!user) {
        throw new AppError("User not found", 404)
    }
    return user
}


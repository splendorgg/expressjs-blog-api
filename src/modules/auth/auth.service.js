import { createKeycloakUser, deleteKeycloakUser, getAdminToken } from "#/modules/auth/keycloak.service.js";
import { prisma } from "#/lib/prisma.js"
import { AppError } from "#/middleware/error.js";


export async function register(dto) {
    const { password, ...userData } = dto

    const existing = await prisma.user.findUnique({
        where: { email: userData.email }
    });
    if (existing) throw new AppError("Email already exists", 400);

    const adminToken = await getAdminToken()
    const keycloakUserId = await createKeycloakUser(adminToken, dto)
    if (!keycloakUserId) {
        throw new AppError("Keycloak user creation failed", 500);
    }
    try {
        const user = await prisma.user.create({
            data: {
                keycloakId: keycloakUserId,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: "USER",
            }
        })
        return user
    } catch (error) {
        const freshToken = await getAdminToken();
        await deleteKeycloakUser(freshToken, keycloakUserId);
        throw error;
    }
}


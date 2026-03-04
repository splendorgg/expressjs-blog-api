import { createKeycloakUser, deleteKeycloakUser, getAdminToken } from "#/modules/auth/keycloak.service.js";
import { prisma } from "#/lib/prisma.js"
import { AppError } from "#/middleware/error.js";


export async function register(dto) {
    const { password, ...userData } = dto;

    const adminToken = await getAdminToken();
    const keycloakUserId = await createKeycloakUser(adminToken, dto);

    try {
        const user = await prisma.user.create({
            data: {
                keycloakId: keycloakUserId,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: "USER",
            }
        });
        return user;
    } catch (error) {
        const freshToken = await getAdminToken();
        await deleteKeycloakUser(freshToken, keycloakUserId);

        if (error.code === 'P2002') {
            throw new AppError("Email already exists in database", 400);
        }
        throw error;
    }
}

import { createKeycloakUser, deleteKeycloakUser, getAdminToken, getKeyCloakToken } from "#/modules/auth/keycloak.service.js";
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


export async function login(dto) {
    const { email, password } = dto
    const token = await getKeyCloakToken(email, password)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('User not found', 404);

    return {
        user, token: {
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            expires_in: token.expires_in,
            token_type: token.token_type
        }
    }
}

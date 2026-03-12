import { createKeycloakUser, deleteKeycloakUser, getAdminToken, getKeycloakToken, logoutKeycloakUser } from "#/modules/auth/keycloak.service.js";
import { prisma } from "#/config/prisma.js"
import { AppError } from "#/middleware/error.middleware.js";
import { decodeJwt } from "jose";


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
    const token = await getKeycloakToken(email, password)
    if (!token) throw new AppError("Invalid email or password", 401);

    const payload = decodeJwt(token.access_token);

    let user = await prisma.user.findUnique({
        where: { keycloakId: payload.sub }
    });

    if (!user) {

        user = await prisma.user.create({
            data: {
                keycloakId: payload.sub,
                email: payload.email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                role: "USER"
            }
        });

    }
    user = await prisma.user.update({
        where: { keycloakId: payload.sub },
        data: { lastLogin: new Date() }
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            level: user.level,
            exp: user.exp,
            avatar: user.avatar,
            streak: user.streak,
        },
        token
    }
}



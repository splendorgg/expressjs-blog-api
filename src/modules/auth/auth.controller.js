import { login, register } from "#/modules/auth/auth.service.js"
import { logoutKeycloakUser, refreshAccessToken } from "#/modules/auth/keycloak.service.js"
import { catchAsync } from "#/utils/catchAsync.js";
import { AppError } from "#/middleware/error.middleware.js";
import { updateStreak } from "#/modules/gamification/streak.service.js";
import { grantXP, XP_REWARDS } from "#/modules/gamification/exp.service.js";

export const AuthController = {
    register: catchAsync(async (req, res) => {
        const user = await register(req.body)
        res.status(201).json(user);

    }),
    login: catchAsync(async (req, res) => {
        const result = await login(req.body);
        res.cookie('refreshToken', result.token.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: result.token.refresh_expires_in * 1000
        });

        const updatedUser = await updateStreak(result.user.id);
        let userWithXP = updatedUser;
        if (updatedUser.streak !== result.user.streak) {
            userWithXP = await grantXP(updatedUser.id, "LOGIN");
        }

        res.status(200).json({
            user: userWithXP,
            token: {
                access_token: result.token.access_token,
                expires_in: result.token.expires_in,
                token_type: result.token.token_type
            }
        });
    }),
    logout: catchAsync(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await logoutKeycloakUser(refreshToken);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(204).send();
    }),
    refreshToken: catchAsync(async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new AppError('No refresh token', 401);

        const token = await refreshAccessToken(refreshToken);

        res.cookie('refreshToken', token.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: token.refresh_expires_in * 1000
        });

        res.status(200).json({
            access_token: token.access_token,
            expires_in: token.expires_in,
            token_type: token.token_type
        });
    }),

}
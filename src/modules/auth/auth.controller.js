import { login, register, logout } from "#/modules/auth/auth.service.js"
import { refreshAccessToken } from "#/modules/auth/keycloak.service.js"
import { catchAsync } from "#/utils/catchAsync.js";

export const AuthController = {
    register: catchAsync(async (req, res) => {
        const user = await register(req.body)
        res.status(201).json(user);

    }),
    login: catchAsync(async (req, res) => {
        const token = await login(req.body)
        res.json(token)
    }),
    logout: catchAsync(async (req, res) => {
        const { refreshToken } = req.body;
        await logout(refreshToken);
        res.status(204).send()
    }),
    refreshToken: tokenRefresh(async (req, res) => {
        const { refreshToken } = req.body;
        const token = await refreshAccessToken(refreshToken);
        res.status(200).json(token)
    }),

}
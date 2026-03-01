
import { AppError } from "#/middleware/error.js"
import { verifyToken } from "#s/utils/auth";

export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Unauthorized — No token provided', 401);
        }
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            throw new AppError('Unauthorized — Empty token', 401);
        }
        const payload = await verifyToken(token)
        req.user = payload
        next()
    } catch (error) {
        if (err instanceof AppError) {
            throw err;
        }
        throw new AppError('Unauthorized — Invalid or expired token', 401);
    }
}
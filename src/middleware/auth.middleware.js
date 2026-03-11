import { AppError } from "#/middleware/error.middleware.js"
import { verifyToken } from "#/modules/auth/auth.js";

export async function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('Unauthorized — No token provided', 401));
        }

        const token = authHeader.replace('Bearer ', '');
        const payload = await verifyToken(token);
        req.user = payload;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        return next(new AppError('Unauthorized — Invalid or expired token', 401));
    }
}

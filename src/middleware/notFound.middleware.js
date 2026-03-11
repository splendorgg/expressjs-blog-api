import { AppError } from "#/middleware/error.middleware.js"

export const notFound = (req, res) => {
    throw new AppError(`Route not found: ${req.originalUrl}`, 404);

}
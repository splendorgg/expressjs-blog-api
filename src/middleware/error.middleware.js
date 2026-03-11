export class AppError extends Error {

    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details
    }
}

export const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(err.details && { details: err.details }),
        });
    }

    return res.status(500).json({
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV !== 'production' && {
            error: err.message || 'Unknown error',
            stack: err.stack,
        }),
    });
};
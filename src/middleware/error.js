export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const isDev = process.env.NODE_ENV === "development"
    res.status(statusCode).json({
        message:
            statusCode >= 500 && !isDev
                ? "Internal Server Error"
                : err.message,
        ...(err.details && { errors: err.details }),
        ...(isDev && { stack: err.stack })
    })
}


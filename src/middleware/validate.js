import { AppError } from "#/middleware/error.js"

export const validate = (schema, property = "body") =>
    (req, res, next) => {
        try {
            const parsed = schema.parse(req[property]);
            req[property] = parsed;
            next();
        } catch (err) {

            if (err instanceof ZodError) {
                const formatted = err.issues.map(e => ({
                    field: e.path.join("."),
                    message: e.message
                }));

                return next(new AppError("Validation failed", 400, formatted));
            }

            return next(err);
        }
    };
import { body, validationResult } from "express-validator"
import { AppError } from "#/utils/AppError.js"

export const validatePost = [
    body("title")
        .exists().withMessage("Title is required")
        .bail()
        .isString().withMessage("Title must be a string")
        .bail()
        .trim()
        .notEmpty().withMessage("Title cannot be empty"),

    body("content")
        .exists().withMessage("Content is required")
        .bail()
        .isString().withMessage("Content must be a string")
        .bail()
        .trim()
        .notEmpty().withMessage("Content cannot be empty"),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(new AppError("Validation failed", 400, errors.array()))
        }
        const { title, content } = req.body
        req.body = { title, content }

        next()
    }

]


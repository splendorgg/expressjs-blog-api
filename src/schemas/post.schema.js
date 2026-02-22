import { z } from "zod"

export const createPostSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(50, "Title must be at most 50 characters"),

    content: z
        .string()
        .trim()
        .min(1, "Content is required")
        .max(500, "Content must be at most 500 characters")

})


export const updatePostSchema = createPostSchema.partial()


export const postIdParamSchema = z.object({
    id: z.coerce
        .number()
        .int("Id must be an integer")
        .positive("Id must be positive")
})
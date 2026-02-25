import { Router } from "express";
import { createNewPost, deletePostById, getPostById, getPosts, updatePostById } from "#/controllers/post-controllers.js";
import { validate } from "#/middleware/validate.js";
import { updatePostSchema, upsertPostSchema } from "#/schemas/post.schema.js";

const router = Router()


router.get("/", getPosts)
router.get("/:id", getPostById)
router.post("/", validate(upsertPostSchema), createNewPost)
router.put("/:id", validate(updatePostSchema), updatePostById)
router.delete("/:id", deletePostById)


export default router
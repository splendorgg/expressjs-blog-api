import { Router } from "express";
import { createNewPost, deletePostById, getPostById, getPosts, updatePostById } from "#/controllers/post-controllers.js";
import { validate } from "#/middleware/validate.js";
import { createPostSchema, postIdParamSchema, updatePostSchema } from "#/schemas/post.schema.js";

const router = Router()


router.get("/", getPosts)
router.get("/:id", getPostById)
router.post("/", validate(createPostSchema), createNewPost)
router.patch("/:id", validate(postIdParamSchema, "params"), validate(updatePostSchema, "body"), updatePostById)
router.delete("/:id", deletePostById)


export default router
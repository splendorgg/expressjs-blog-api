import { Router } from "express";
import { createNewPost, deletePostById, getPostById, getPosts, updatePostById } from "#/controllers/post-controllers.js";
import { validatePost } from "#/middleware/validate.js";

const router = Router()


router.get("/", getPosts)
router.get("/:id", getPostById)
router.post("/", validatePost, createNewPost)
router.put("/:id", validatePost, updatePostById)
router.delete("/:id", deletePostById)


export default router
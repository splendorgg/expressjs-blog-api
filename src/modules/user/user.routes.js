import { Router } from "express"
import { authMiddleware } from "#/middleware/auth.middleware.js"
import { UserController } from "#/modules/user/user.controller.js";


const router = Router()

router.use(authMiddleware)
router.get('/me', UserController.getMe);







export default router
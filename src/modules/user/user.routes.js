import { Router } from "express"
import { authMiddleware } from "#/middleware/auth.middleware.js"


const router = Router()

router.use(authMiddleware)

router.get('/me',)






export default router
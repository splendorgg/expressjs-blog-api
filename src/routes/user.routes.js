import { Router } from "express";
import { validate } from "#/middleware/validate.js";
import { loginUserValidatorSchema, registerUserValidatorSchema } from "#/schemas/user.schema.js";
import { AuthController } from "#/modules/auth/auth.controller.js";
import { authMiddleware } from "#/middleware/auth.middleware.js";


const router = Router()

router.post('/register', validate(registerUserValidatorSchema), AuthController.register)
router.post('/login', validate(loginUserValidatorSchema), AuthController.login)
router.post('/logout', authMiddleware, AuthController.logout)


export default router
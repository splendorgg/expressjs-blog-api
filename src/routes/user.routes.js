import { Router } from "express";
import { validate } from "#/middleware/validate.js";
import { registerUserValidatorSchema } from "#/schemas/user.schema.js";
import { AuthController } from "#/modules/auth/auth.controller.js";


const router = Router()

router.post('/register', validate(registerUserValidatorSchema), AuthController.register)
router.post('/login', AuthController.login)



export default router
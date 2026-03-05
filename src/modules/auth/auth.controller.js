import { login, register } from "#/modules/auth/auth.service.js"

export const AuthController = {
    register: async (req, res) => {
        const user = await register(req.body)
        res.status(201).json(user);

    }
    login: async (req, res) => {
        
    }
}
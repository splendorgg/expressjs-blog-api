import { catchAsync } from "#/utils/catchAsync.js";
import { getUserByKeycloakId } from "#/modules/user/user.service.js";


export const UserController = {
    getMe: catchAsync(async (req, res) => {
        const user = await getUserByKeycloakId(req.user.sub)
        const { keycloakId, ...safeUser } = user;
        res.status(200).json(safeUser);
    })
}
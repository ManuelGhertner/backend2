import { Router} from "express";
import { createUser, getUsers, addCartToUser, getUsersInactiveForTwoDays, deleteUser, updateUserRoleController } from "../controllers/users.controller.js";
import {validate, validateAdmin, validatepPremiumOrAdmin} from "../middlewares/validate.middleware.js"

const usersRouter = Router();



usersRouter.post("/users", createUser);

usersRouter.get("/users",validateAdmin, getUsers);

usersRouter.delete("/users/:pid", validateAdmin, deleteUser);

usersRouter.post("/users/:cid/cart/:pid",  addCartToUser);  

usersRouter.get("/usersinactive",getUsersInactiveForTwoDays)

usersRouter.post('/users/updaterole/:pid', updateUserRoleController);



export default usersRouter;
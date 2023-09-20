import { Router} from "express";
import { createUser, getUsers, addCartToUser, getUsersInactiveForTwoDays } from "../controllers/users.controller.js";
import {validate, validateAdmin, validatepPremiumOrAdmin} from "../middlewares/validate.middleware.js"

const usersRouter = Router();

// AGREGAR PRODUCTO

usersRouter.post("/users", createUser);

usersRouter.get("/users",validateAdmin, getUsers);


usersRouter.post("/users/:cid/cart/:pid",  addCartToUser);  

usersRouter.get("/usersinactive",getUsersInactiveForTwoDays)
// usersRouter.get("*", async (req, res) =>{
//     res.status(400).send({status: "ERROR", msg: "Formato de parametro invalido"});
// });


export default usersRouter;
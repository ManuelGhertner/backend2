import { Router} from "express";
import { createUser, getUsers, addCartToUser } from "../controllers/users.controller.js";

const usersRouter = Router();

// AGREGAR PRODUCTO

usersRouter.post("/users", createUser);

usersRouter.get("/users", getUsers);


usersRouter.post("/users/:cid/cart/:pid",  addCartToUser);  


// usersRouter.get("*", async (req, res) =>{
//     res.status(400).send({status: "ERROR", msg: "Formato de parametro invalido"});
// });


export default usersRouter;
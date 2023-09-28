import { addProductToCart, createCart, getCarts, deleteCart, getTickets, getCartById, getCartByUserId, purchaseCart, addEmailToCart } from "../controllers/carts.controller.js"
import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import { Router } from "express";

const cartsRouter = Router();

cartsRouter.post("/carts",createCart, validate);

cartsRouter.get("/carts",  getCarts);

cartsRouter.post("/carts/confirm/:pid",validate,addEmailToCart );

cartsRouter.get("/carts/:cid",  getCartByUserId);

cartsRouter.post("/carts/product/:pid", validate, addProductToCart);  

cartsRouter.delete("/cartdelete/:cid",  deleteCart);

cartsRouter.post('/carts/:cid/purchase',validate ,purchaseCart);

cartsRouter.get("/carts/:cid",  getCartById);

cartsRouter.get("/tickets", getTickets)



export default cartsRouter;
import { addProductToCart, createCart, getCarts, deleteCart, getCartById, getCartByUserId, purchaseCart } from "../controllers/carts.controller.js"
import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import { Router } from "express";

const cartsRouter = Router();

cartsRouter.post("/carts",createCart , validate);
cartsRouter.get("/carts",  getCarts);
cartsRouter.get("/carts/:cid",  getCartByUserId);
cartsRouter.post("/carts/product/:pid",  addProductToCart);  
// cartsRouter.post("/carts/:pid", createCartAndAddProduct);
cartsRouter.delete("/cartdelete/:cid",  deleteCart);
cartsRouter.post('/carts/:cid/purchase', purchaseCart);
cartsRouter.get("/carts/:cid",  getCartById);
// //DELETE - Borrar producto del carrito.
// cartsRouter.delete("/carts/:cid/product/:pid",  deleteProduct);

// //PUT - actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
// cartsRouter.put("/carts/:cid/product/:pid",  updateProductQuantity);

// //DELETE - Borrar todos los productos del carrito.
// cartsRouter.delete("/carts/:cid", deleteAllProducts);

// //GET - Obtener un carrito por id.



// cartsRouter.get("*", async (req, res) =>{
//     res.status(400).send({status: "ERROR", msg: "Formato de parametro invalido"});
// });

export default cartsRouter;
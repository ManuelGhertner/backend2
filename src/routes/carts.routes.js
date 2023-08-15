import { addProductToCart, createCart, getCarts, deleteCart, getCartById } from "../controllers/carts.controller.js"
// import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import { Router } from "express";

const cartsRouter = Router();

//POST - Crear carrito.
cartsRouter.post("/carts", createCart);

// GET - Listar todos los carritos.
cartsRouter.get("/carts",  getCarts);

//POST - Agregar producto al carrito.
cartsRouter.post("/carts/:cid/product/:pid",  addProductToCart);  

// //DELETE - Borrar carrito.
cartsRouter.delete("/cartdelete/:cid",  deleteCart);

// //DELETE - Borrar producto del carrito.
// cartsRouter.delete("/carts/:cid/product/:pid",  deleteProduct);

// //PUT - actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
// cartsRouter.put("/carts/:cid/product/:pid",  updateProductQuantity);

// //DELETE - Borrar todos los productos del carrito.
// cartsRouter.delete("/carts/:cid", deleteAllProducts);

// //GET - Obtener un carrito por id.
cartsRouter.get("/carts/:cid",  getCartById);


// cartsRouter.get("*", async (req, res) =>{
//     res.status(400).send({status: "ERROR", msg: "Formato de parametro invalido"});
// });

export default cartsRouter;

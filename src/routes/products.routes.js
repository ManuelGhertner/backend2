import { Router} from "express";
import { addProducts, getById, getProducts, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const productsRouter = Router();

// AGREGAR PRODUCTO

productsRouter.post("/products", addProducts);

productsRouter.get("/products/:pid([a-zA-Z0-9]+)", getById);

productsRouter.get("/products", getProducts);

productsRouter.put("/products/:pid([a-zA-Z0-9]+)", updateProduct);

productsRouter.delete("/products/:pid([a-zA-Z0-9]+)", deleteProduct);

productsRouter.get("*", async (req, res) =>{
    res.status(400).send({status: "ERROR", msg: "Formato de parametro invalido"});
});


export default productsRouter;

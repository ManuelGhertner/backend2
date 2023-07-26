import { Router} from "express";
import { addProducts, getById, getProducts, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const productsRouter = Router();

// AGREGAR PRODUCTO

productsRouter.post("/products", addProducts);

productsRouter.get("/products/:pid", getById);

productsRouter.get("/products", getProducts);

productsRouter.put("/products/:pid", updateProduct);

productsRouter.delete("/products/:pid", deleteProduct);

export default productsRouter;

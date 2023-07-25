import { Router} from "express";
import { addProducts, getById, getProducts } from "../controllers/products.controller.js";

const productsRouter = Router();

// AGREGAR PRODUCTO

productsRouter.post("/products", addProducts);

productsRouter.get("/products/:pid", getById);

productsRouter.get("/products", getProducts);

export default productsRouter;

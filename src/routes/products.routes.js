import { Router} from "express";
import { addProducts, getById } from "../controllers/products.controller.js";

const productsRouter = Router();

// AGREGAR PRODUCTO

productsRouter.post("/products", addProducts);

productsRouter.get("/products/:pid", getById);

export default productsRouter;

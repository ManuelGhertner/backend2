import { Router} from "express";
import { addProducts, getById, getProducts, updateProduct, deleteProduct, getProductsFromUser } from "../controllers/products.controller.js";
import {validate, validateAdmin, validatepPremiumOrAdmin} from "../middlewares/validate.middleware.js"


const productsRouter = Router();


productsRouter.post("/products", validatepPremiumOrAdmin, addProducts); //despues agregar admin AGREGAR validatepPremiumOrAdmin !!!!11

productsRouter.get("/products/:pid([a-zA-Z0-9]+)", getById);

productsRouter.get("/products", getProducts);

productsRouter.get("/productsowned", validatepPremiumOrAdmin, getProductsFromUser);

productsRouter.put("/products/:pid([a-zA-Z0-9]+)",validateAdmin, updateProduct);

productsRouter.delete("/products/:pid", validatepPremiumOrAdmin, deleteProduct);




export default productsRouter;
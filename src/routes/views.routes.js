import { realTimeProducts, profile, register, login, verifySession, logout, cart, getUsers, addProducts, getProducts, getAllProducts, renderizarCarritoUsuario } from "../controllers/views.controller.js";
import { Router } from "express";
import passport from "passport";
import {validate, validateAdmin, validatepPremiumOrAdmin} from "../middlewares/validate.middleware.js"

const routerViews = () =>{
    const router = Router();


    router.get('/realtimeproducts', realTimeProducts);

    router.get("/productsowned", validatepPremiumOrAdmin, getProducts)

    router.get("/allproductsdb",validateAdmin, getAllProducts)

    router.get("/products",validatepPremiumOrAdmin, addProducts)

    router.post("/api/products", addProducts)
    
    router.get("/register", register);

    router.post("/register", passport.authenticate("register", {successRedirect: "/", failureRedirect: "/failedRegister", failureFlash: true }), async (req, res) => {
        res.send({ status: "OK", message: "Usuario registrado correctamente"});
    });

    router.get("/api/carts/:cid", validate, renderizarCarritoUsuario)

    router.get("/profile", validate, profile);

    router.get("/usuarios",validateAdmin,getUsers)

    router.post("/login", passport.authenticate("login", { failureRedirect: "/failedLogin" }), login);

    router.get("/", verifySession);

    router.get("/logout", logout);

    return router;
};





export default routerViews;
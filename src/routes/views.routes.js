import { realTimeProducts, profile, register, login, verifySession, logout, cart, getUsers, addProducts, getProducts, getAllProducts, renderizarCarritoUsuario } from "../controllers/views.controller.js";
import { Router } from "express";
import passport from "passport";
import {validate, validateAdmin, validatepPremiumOrAdmin} from "../middlewares/validate.middleware.js"

const routerViews = () =>{
    const router = Router();

//REALTIMEPRODUCTS
    router.get('/realtimeproducts', realTimeProducts);
    router.get("/productsowned", validatepPremiumOrAdmin, getProducts)
    router.get("/allproductsdb",validateAdmin, getAllProducts)



//AGREGAR PRODUCTO
    router.get("/products",validatepPremiumOrAdmin, addProducts)
    router.post("/api/products", addProducts)
    
//REGISTRO
    router.get("/register", register);

    router.post("/register", passport.authenticate("register", {successRedirect: "/", failureRedirect: "/failedRegister", failureFlash: true }), async (req, res) => {
    res.send({ status: "OK", message: "Usuario registrado correctamente"});
});

 //CARTS
// router.get("/api/carts/:cid", validate, cart);
// router.get("/api/carts", validate, cart);
router.get("/api/carts/:cid", validate, renderizarCarritoUsuario)

router.get("/profile", validate, profile);

router.get("/usuarios",validateAdmin,getUsers)

// LOGIN
router.post("/login", passport.authenticate("login", { failureRedirect: "/failedLogin" }), login);

// VERIFICAR SESION

router.get("/", verifySession);

// LOGOUT

router.get("/logout", logout);

    return router;
};





export default routerViews;
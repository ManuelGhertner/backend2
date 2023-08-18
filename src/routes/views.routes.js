import { realTimeProducts, profile, register, login, verifySession, logout, cart } from "../controllers/views.controller.js";
import { Router } from "express";
import passport from "passport";
import {validate, validateAdmin} from "../middlewares/validate.middleware.js"

const routerViews = () =>{
    const router = Router();

//REALTIMEPRODUCTS
    router.get('/realtimeproducts', realTimeProducts);
    
//REGISTRO
    router.get("/register", register);

    router.post("/register", passport.authenticate("register", {successRedirect: "/", failureRedirect: "/failedRegister", failureFlash: true }), async (req, res) => {
    res.send({ status: "OK", message: "Usuario registrado correctamente"});
});

 //CARTS
 router.get("/carts/:cid", validate, cart);

router.get("/profile", validate, profile);


// LOGIN
router.post("/login", passport.authenticate("login", { failureRedirect: "/failedLogin" }), login);

// VERIFICAR SESION

router.get("/", verifySession);

// LOGOUT

router.get("/logout", logout);

    return router;
};





export default routerViews;
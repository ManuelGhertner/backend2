import { realTimeProducts, register, login, verifySession, logout } from "../controllers/views.controller.js";
import { Router } from "express";
import passport from "passport";

const routerViews = () =>{
    const router = Router();

//REALTIMEPRODUCTS
    router.get('/realtimeproducts', realTimeProducts);
    
//REGISTRO
    router.get("/register", register);

    router.post("/register", passport.authenticate("register", {successRedirect: "/", failureRedirect: "/failedRegister", failureFlash: true }), async (req, res) => {
    res.send({ status: "OK", message: "Usuario registrado correctamente"});
});



// LOGIN
router.post("/login", passport.authenticate("login", { failureRedirect: "/failedLogin" }), login);

// VERIFICAR SESION

router.get("/", verifySession);

// LOGOUT

router.get("/logout", logout);

    return router;
};





export default routerViews;
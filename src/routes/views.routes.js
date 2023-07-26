import { realTimeProducts, register } from "../controllers/views.controller.js";
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


    return router;
};




export default routerViews;
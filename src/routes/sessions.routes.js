import { Router } from "express";
import initializePassport from "../passport/passport.strategies.js";
import passport from "passport";

const sessionRoutes = () => {
    const routes = Router();

    //GITHUB.
    routes.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async(req, res) => {});

    routes.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/" }), async(req, res) => {
        req.session.user = req.user;
        req.session.userValidated = true;
        /* console.log(req.session.user) */
        res.redirect("/");
    })


    //CURRENT. Datos de usuario
    routes.get("/current", (req, res) => {
        res.send({ status: "success", payload: req.user });
    });
    
    return routes;
}

export default sessionRoutes
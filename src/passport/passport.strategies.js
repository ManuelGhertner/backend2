import { createHash, generateToken, validPassword } from "../utils.js";
import { Strategy as GithubStrategy } from "passport-github2";
import local from "passport-local";
import passport from "passport";
import userModel from "../dao/models/users.model.js";

const LocalStrategy = local.Strategy;

const initializePassport = () =>{

    // REGISTRO
    passport.use("register", new LocalStrategy({passReqToCallback: true, usernameField: "email"},
    async (req, username, password, done) =>{
        const { firstName, lastName, email} = req.body;
        try{
            const user = await userModel.findOne({email: username});
            if (user) {
                console.log("El usuario ya se encuentra registrado");
                return done(null, false);
            };
            const newUser = {
                firstName,
                lastName,
                email,
                password: createHash(password)
            }

            const createdUser = await userModel.create(newUser);
            return done(null, createdUser);
        } catch (err) {
            return done (err);
        };
    }
    ));

    // LOGIN

    // passport.use("login", new LocalStrategy({usernameField: "email", passReqToCallback: true},
    // async (req, email, password, done) =>{
    //     try{

    //     }
    // }
    // ))
        // SERIALIZE
        passport.serializeUser((user, done) => {
            done(null, user);
        })
    
        // DESERIALIZE
        passport.deserializeUser(async (user, done) => {
            try {
                done(null, user);
            } catch(err) {
                done(err.message)
            }
        });
}

export default initializePassport;
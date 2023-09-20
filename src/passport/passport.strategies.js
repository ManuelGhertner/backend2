import { createHash, generateToken, validPassword } from "../utils.js";
import { Strategy as GithubStrategy } from "passport-github2";
import local from "passport-local";
import passport from "passport";
import userModel from "../dao/models/users.model.js";
import config from "../config.js";

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

    passport.use("login", new LocalStrategy({usernameField: "email", passReqToCallback: true},
    async (req, email, password, done) =>{
        try{
             const user = await userModel.findOne({email}) // .populate("cart");
            if(!user){
                req.session.errorMessages = "El usuario no esta registrado";
                return done (null, false, {message: "El usuario no esta registrado"});
            };
            if(!validPassword(password, user)){
                req.session.errorMessages = "Contraseña incorrecta";
                return done(null, false, { message: "Contraseña incorrecta"});
            };

            user.lastLogin = new Date();
            await user.save()
            return done (null, user);       
        } catch (err){
            return done(err);
        }
    }
    ));

    // LOGIN CON GITHUB

    const githubData = {
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACK_URL
    };

    const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email == null ? profile._json.username : null;
            const user = await userModel.findOne({ email: profile._json.email });
            console.log(user) 
            console.log("profile :", profile);

            if(!user) {
                const newUser = {
                    firstName: profile._json.login,
                    email: email,
                    id: profile._json.id,
                }
                const createdUser = await userModel.create(newUser);
                done(null, createdUser)
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(null, error);
        }
    };
    
    passport.use(new GithubStrategy(githubData, verifyAuthGithub));


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
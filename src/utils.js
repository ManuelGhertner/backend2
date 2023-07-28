import * as url from "url";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import {} from "dotenv/config";
import MongoStore from "connect-mongo"

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
//BCRYPT

// HASHEO
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// VALIDACION PASSWORD
const validPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
};

const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, { expiresIn: "1h" })
    return token;
};
// GESTION DE SESIONES

const store = MongoStore.create({mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl:60});

export { __filename, __dirname, createHash, validPassword, generateToken, store}; //agregar lo que falta despues
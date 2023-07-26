import * as url from "url";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import {} from "dotenv/config";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

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

export { __filename, __dirname, createHash, validPassword, generateToken}; //agregar lo que falta despues
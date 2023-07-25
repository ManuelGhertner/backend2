import * as url from "url";
import bcrypt from "bcrypt";

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

export { __filename, __dirname, createHash, validPassword}; //agregar lo que falta despues
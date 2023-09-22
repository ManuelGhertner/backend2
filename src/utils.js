import * as url from "url";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import config from "./config.js";
import MongoStore from "connect-mongo"
import { Faker, en } from '@faker-js/faker';

const __filename = url.fileURLToPath(import.meta.url);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const MONGOOSE_URL = config.MONGOOSE_URL;

const PRIVATE_KEY = config.PRIVATE_KEY;

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const validPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
};

const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, { expiresIn: "1h" })
    return token;
};

const store = MongoStore.create({mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl:60});

const faker = new Faker({ locale: [en] })

const generateProduct = () => {
   return {
       id: faker.database.mongodbObjectId(),
       title: faker.commerce.productName(),
       price: faker.commerce.price(),
       department: faker.commerce.department(),
       stock: faker.number.int(50),
       image: faker.image.urlLoremFlickr(),
       description: faker.commerce.productDescription()
   }
}

export { __filename, __dirname, createHash, validPassword, generateToken, generateProduct, store}; //agregar lo que falta despues
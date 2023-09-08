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

// MOCKING




const faker = new Faker({ locale: [en] })

// export const generateUser = () => {
//    let products = [];
//    const productsQty = parseInt(faker.number.int(8));
//    for (let i = 0; i < productsQty; i++) { products.push(generateProduct()); }

//    const role = parseInt(faker.number.int(1)) === 1 ? 'client': 'seller';

//    return {
//        id: faker.database.mongodbObjectId(),
//        code: faker.string.alphanumeric(8),
//        name: faker.person.firstName(),
//        last_name: faker.person.lastName,
//        sex: faker.person.sex(),
//        birthDate: faker.date.birthdate(),
//        phone: faker.phone.number(),
//        image: faker.image.avatar(),
//        email: faker.internet.email(),
//        role: role,
//        premium: faker.datatype.boolean(),
//        current_job: faker.person.jobType(),
//        zodiac_sign: faker.person.zodiacSign(),
//        products: products
//    }
// }

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
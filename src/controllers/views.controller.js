import productsDB from "../dao/services/products.dbclass.js";
import productModel from "../dao/models/products.model.js";

const products = new productsDB();

// REALTIME PRODUCTS
export const realTimeProducts = async (req, res) => {
    const currentProducts = await productModel.find().lean()
    res.render('realTimeProducts', { products: currentProducts });
};

// REGISTRO
export const register = async (req, res) => {
    if(req.session.userValidated === true ) {
        res.redirect("/")
    } else {
        res.render("register", { errorMessages: req.session.errorMessages })
    }
};

import factoryProduct from "../dao/services/factory.js";
import CustomError from "../dao/services/customError.js";
import errorsDict from "../dictionary.js";
import { addLogger } from "../dao/services/logger.service.js";
const product = new factoryProduct("../src/db/products.json");



// AGREGAR PRODUCTOS

export const addProducts = async (req, res, next) =>{
    try{
        const productData = req.body;
        const loggedInUser = req.session.user;
        productData.owner = loggedInUser.id;
        await product.addProduct(req.body);
        const status = product.status;
        if(product.status === 1){
            res.status(200).send({ status: "Success", product});
        } else {
            throw new CustomError(errorsDict.INVALID_TYPE_ERROR);
        };
    } catch (err){
        req.logger.error(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`)
        next(err);
    };
};

// OBTENER PRODUCTO POR ID
 
export const getById = async (req, res) =>{
    try {
        const pid = req.params.pid;
        const producto = await product.getProductById(pid);
        if(producto){
            res.status(200).send({status: "Sucess", producto});
        } else{
            res.status(400).send({status: "Error404"})
        };
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    };
};

// OBTENER PRODUCTOS

export const getProducts = async (req, res) =>{
    const{limit, page, sort, category , status} = req.query;

    try{
        let products = await product.getProducts(limit, page, sort, category, status);
        res.status(200).send(products);
    } catch(err){
        res.status(500).send(err.message)
    };
};

// ACTUALIZAR PRODUCTOS

export const updateProduct = async (req, res) => {
    try{
        const pid = req.params.pid;
        const id = await product.getProductById(pid);
        const producto = await product.updateProduct(pid, req.body);
        const idHex = id._id.toString();
        if(pid === idHex){
            res.status(200).send({ status: "success", producto })
        } else {
            res.status(400).send({status: "Error404"})
        }
       
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
};

// ELIMINAR PRODUCTOS

export const deleteProduct = async (req, res) =>{
    try{
        const pid = req.params.pid;
        await product.deleteProduct(pid);
        res.status(200).send({ status: "OK", msg: "Producto eliminado"});
    } catch (err){
        res.status(500).send({ status: "Error", error: err})
    };
};

// import ProductsDB from "../dao/services/products.dbclass.js";
// import ProductsDB from "../dao/services/products.local.js"
import factoryProduct from "../dao/services/factory.js";
const product = new factoryProduct("../src/db/products.json");
// const product = new ProductsDB();

// AGREGAR PRODUCTOS

export const addProducts = async (req, res) =>{
    try{
        await product.addProduct(req.body);
        const status = product.status;
        if(product.status === 1){
            res.status(200).send({ status: "Success", product});
        } else {
            res.status(404).send({ status: "Error404", error: product.showStatusMsg});
        };
    } catch (err){
        console.log(err);
        res.status(500).send({ status: "Error500", error: err});
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

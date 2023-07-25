import productsDB from "../dao/services/products.dbclass.js";

const product = new productsDB();

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
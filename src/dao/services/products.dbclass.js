import mongoose from "mongoose";
import productModel from "../models/products.model.js";

class productsDB {
    static newId = 0;

    constructor(){
        // this.products = [];
        this.status = 0;
        this.statusMsg = "INICIADO";
    };

    checkStatus = () =>{
        return this.statusMsg;
    };
    showStatusMsg = () =>{
        return this.statusMsg;
    }

// AGREGAR PRODUCTO

addProduct = async (product) =>{
    try{
        const newProduct = await productModel.create(product);
        await newProduct.save();
        this.status = 1;
        this.statusMsg = "Producto registrado en la base de datos";
        return newProduct;
    } catch (err){
        this.status = -1;
        this.statusMsg = "El producto no pudo ser agregado a la base de datos";
    };
};

getProductById = async (id) =>{
    try {
        return await productModel.findById({"_id": new mongoose.Types.ObjectId(id)}).lean();
    } catch (err){
        this.status = -1;
        this.statusMsg = `getProductById : ${err}`;
    }
};

}

export default productsDB;
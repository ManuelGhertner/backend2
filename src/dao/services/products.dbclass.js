import mongoose from "mongoose";
import productModel from "../models/products.model.js";

class ProductsDB {
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

// OBTENER PRODUCTO POR ID
getProductById = async (id) =>{
    try {
        return await productModel.findById({"_id": new mongoose.Types.ObjectId(id)}).lean();
    } catch (err){
        this.status = -1;
        this.statusMsg = `getProductById : ${err}`;
    }
};

// OBTENER PRODUCTOS
getProducts = async(limit, page, sort, category, status) =>{
    let data = {
        limit: limit || 3,
        page: page || 1,
        sort: sort === "asc" ? {price: 1} : "" || sort === "desc" ? {price: -1} : "",
        lean: true
    };
    let query = {};

    if(category) {
        query.category = category;
    };

    if(status){
        query.status = status;
    };
    try {
        let products = await productModel.paginate(query, data);
        let prevLink = `http://localhost:8000/api/products/?page=${products.prevPage}&limit=${products.limit}&sort=${sort}` || null
        let nextLink = `http://localhost:8000/api/products/?page=${products.nextPage}&limit=${products.limit}&sort=${sort}` || null

        const productFind = () => {
            if(Boolean(products.docs)) {
                return "success";
            } else {
                return "error";
            }
        }

        return {
            status: productFind(),
            payload: products.docs,
            totalDocs: products.totalDocs,
            limit: products.limit,
            totalPages: products.totalPages,
            page: products.page,
            pagingCounter: products.pagingCounter,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        }
    } catch (err) {
        return err;
    }
};

// ACTUALIZAR PRODUCTO
updateProduct = async(id, object) =>{
    try{
        await productModel.findByIdAndUpdate({"_id": new mongoose.Types.ObjectId(id)}, object);
    } catch(err){
        return err;
    }
};

// ELIMINAR PRODUCTO

deleteProduct = async(id) =>{
    try{
        const deleter = await productModel.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        deleter.deletedCount === 0 ? console.log("El ID no existe") : console.log("Producto eliminado");;
    } catch (err) {
        return err;
    }
};
}

export default ProductsDB;
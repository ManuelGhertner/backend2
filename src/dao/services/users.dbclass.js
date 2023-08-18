import userModel from "../models/users.model.js";
import mongoose from "mongoose";
import { createHash } from "../../utils.js";
import cartModel from "../models/carts.model.js";

class Users{
    constructor(){
        this.status = 0;
        this.statusMsg = "Initialized";
    }

    static requiredFields = ["firsName", "lastName", "email", "age", "password"];

    static #verifyRequiredFields = (obj) => {
        return Users.requiredFields.every(field => obj.hasOwnProperty.call(obj, field) && obj[field] !== null);
    };

    static #objEmpty(obj) {
        return Object.keys(obj).length === 0;
    };

    showStatusMsg = () => {
        return this.statusMsg;
    };

    addUser = async (user) =>{
        try{
            if(!Users.#objEmpty(user)) {
                user.password = createHash(user.password);
                const process = await userModel.create(user);
                this.status = 1;
                this.statusMsg = "Usuario registrado en BBDD";
            } else {
                this.status = -1;
                this.statusMsg = "Faltan campos requeridos";
            };
        } catch (err){
            this.status = -1;
            this.statusMsg = ` AddUser: ${err}`;
        }
    };

    getUsers = async() => {
        try {
            const users = await userModel.find().populate("cart").lean();
            this.statusMsg = "Usuarios obtenidos con exito";
            console.log(users);
            return users
        } catch(err) {
            this.statusMsg = `getUsers: ${err.message}`;
        } 
    };

    addCartToUser = async (userId, cartId) => {
        try {
            let user = await userModel.findOne({ '_id': new mongoose.Types.ObjectId(userId) });
            let cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartId) });
            console.log(user);
            console.log(cart);
            let carts = user.cart;
            console.log( carts);
            let index = carts.findIndex((c) => c.carts._id == cartId);
            console.log(index);
    
            if (index >= 0) {
                // Carrito ya existe para este usuario
                return "Cart already exists for this user.";
            } else {
                let newCart = {
                    carts: cart,
                };
                console.log(cart.products, "productos cart");
                console.log(cartId);
                console.log(newCart, "new cart");
                console.log(user.cart.carts, "cart");
                let result = await userModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(userId) }, {$push:{"cart":newCart}});
                
                return result;
            }
        } catch(err) {
            return err;
        }
    }
}

export default Users;
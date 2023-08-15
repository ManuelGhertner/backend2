import userModel from "../models/users.model.js";
import mongoose from "mongoose";
import { createHash } from "../../utils.js";

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
            let carts = user.cart;
            let index = carts.findIndex((c) => c.carts._id == cartId);
    
            if (index >= 0) {
                // Carrito ya existe para este usuario
                return "Cart already exists for this user.";
            } else {
                let newCart = {
                    cart: cartId,
                    products: [] // Puedes inicializarlo con productos si es necesario
                };
                
                let result = await userModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(userId) }, {$push:{"carts":newCart}});
                return result;
            }
        } catch(err) {
            return err;
        }
    }
}

export default Users;
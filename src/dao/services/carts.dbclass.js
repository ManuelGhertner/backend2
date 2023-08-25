import mongoose from 'mongoose';
import cartModel from '../models/carts.model.js';
import userModel from '../models/users.model.js';

class Carts {
    constructor(){
        this.status = 0;
        this.statusMsg = "Iniciado";
      }
      checkStatus = () => {
        return this.status;
      };
    
      showStatusMsg = () => {
        return this.statusMsg;
      };
      static #objEmpty(obj) {
        return Object.keys(obj).length === 0;
      };

      addCart = async(cart) =>{
        try{
            if (!Carts.#objEmpty(cart)) {
                await cartModel.create({ ...cart, id: Carts.idUnico });
                this.status = 1;
                this.statusMsg = "Carrito registrado en la base de datos";
              } else {
                this.status = -1;
                this.statusMsg = `Campos obligatorios incompletos`;
              }
            } catch (err) {
              this.status = -1;
              this.statusMsg = `addCart: ${err}`; 
        }
      };

      getCarts = async () =>{
        try {
            const data = await cartModel.find().lean().populate('products.product');
            return data;
        } catch(err) {
            return  err;
        }
      };

      getCartById = async(cartId) => {
        try {
            return await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');
        }catch(err) {
            console.log(err)
        }
    };

   getCartByUserId = async (userId) => {
    try {
        const user = await userModel.findById(userId).lean();
        if (!user) {
            return null; // Retorna nulo si el usuario no se encuentra
        }

        const cartIdArray = user.cart.map(cartObj => cartObj.carts);
        const firstCartId = cartIdArray[0];

        const cartData = await cartModel
            .findById(firstCartId)
            .lean()
            .populate('products.product');

        return cartData;
    } catch(err) {
        throw err;
    }
};

    addProductToCart = async(cartId, productId) => {
        try {
            let cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartId) });
            let productsInCart = cart.products;
            let index = productsInCart.findIndex((p) => p.product._id == productId );
            let obj = productsInCart[index]

            if(index >= 0) {
                obj.quantity++
                productsInCart[index] = obj
                let result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { products: productsInCart });
                return result;

            } else {
                let newObj = {
                    product: productId,
                    quantity: 1
                };
                
                let result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, {$push:{"products":newObj}});
                return result;
            }
        } catch(err) {
            return err;
        }
    }

        deleteCart = async(cartId) => {
          try {
              const newData = await cartModel.deleteOne({ _id: cartId });
              return newData;
          } catch(err) {
              return err;
          }
      }

      getCartById = async(cartId) => {
        try {
            return await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');
        }catch(err) {
            console.log(err)
        }
    }


      

}

export default Carts;

import mongoose from 'mongoose';
import cartModel from '../models/carts.model.js';
import userModel from '../models/users.model.js';
import productModel from '../models/products.model.js';
import ProductsDB from './products.dbclass.js';
import ticketModel from '../models/ticket.model.js';

const product = new ProductsDB();
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

      addEmailToCart = async (cartId, userEmail) => {
        try {
            await cartModel.findByIdAndUpdate(
                { '_id': new mongoose.Types.ObjectId(cartId) },
                { $set: { email: userEmail } }
            );
        } catch (err) {
            return err;
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

    purchaseCart = async(cartId) =>{
      try {
        // Obtén el carrito y su contenido
        let id;
        let quantity;
        const {products} = await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');
        console.log(products, "cart data");
        const productIds = []; 
        const productQuantitys = []; 
        for (const productItem of products) {
            const producto = productItem.product;
            quantity = productItem.quantity;
            console.log(producto, "producto");
            id = producto._id.toString();
            productIds.push(id);
            productQuantitys.push(quantity);
          }
          console.log(productIds);
          console.log(productQuantitys, "cantidad");
          let canPurchase = true; // Variable para verificar si se puede comprar
        
          for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const quantityToPurchase = productQuantitys[i];
    
            const item = await product.getProductById(productId);
            console.log(item, "productos");
            
            if (item.stock < quantityToPurchase) {
                canPurchase = false;
                console.log("No hay suficiente stock para el producto:", item.title);
                break; // Si un producto no tiene suficiente stock, no se puede comprar
            } else {
                console.log("Hay stock suficiente para el producto:", item.title);
                
                item.stock -= quantityToPurchase; // Resta la cantidad que se va a comprar
                console.log(item.stock);
                
                await productModel.findByIdAndUpdate(
                    { '_id': new mongoose.Types.ObjectId(productId) },
                    { $set: { stock: item.stock } }
                );
            }
        }
          return canPurchase;
  } catch(err) {
    console.log(err)
}
    }


    purchaseCartWithTicket = async(cartId, purchaserEmail) => {
      try {
        // ... obtén el carrito y los productos ...
  
        const canPurchase = await this.purchaseCart(cartId);
        const userCart = await cartModel.findById(cartId).populate('user', 'email'); // Popula el campo 'user' para obtener solo el correo
        const purchaserEmail = userCart.email;
        if (canPurchase) {
          // // Calcula el monto total de la compra
          // const totalAmount = product.reduce((total, productItem) => {
          //   const item = productItem.product;
          //   const quantityToPurchase = productItem.quantity;
          //   return total + item.price * quantityToPurchase;
          // }, 0);
  
          // Crea un nuevo ticket
          const ticket = new ticketModel({
            code: generateUniqueCode(), // Implementa una función para generar un código único
            amount: totalAmount,
            purchaser: purchaserEmail
          });
  
          await ticket.save();
  
          // Actualiza el stock y realiza otras operaciones de compra aquí
          for (const productItem of product) {
            await product.reduceProductStock(productItem.product._id, productItem.quantity);
          }
  
          return true; // La compra se realizó exitosamente
        }
  
        return false; // No se puede realizar la compra debido a stock insuficiente
      } catch (error) {
        console.error(error);
        return false; // Error al procesar la compra
      }
    }
  };
  

  
export default Carts;

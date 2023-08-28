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

//     purchaseCart = async(cartId) =>{
//       try {
//         // Obtén el carrito y su contenido
//         console.log("-----------------------------------------------");
//         let id;
//         let quantity;
//         const outOfStockProductIds = [];
//         const {products} = await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');
//         console.log(products, "cart data");
//         const productIds = []; 
//         const productQuantitys = []; 
//         for (const productItem of products) {
//             const producto = productItem.product;
//             quantity = productItem.quantity;
//             console.log(producto, "producto");
//             id = producto._id.toString();
//             productIds.push(id);
//             productQuantitys.push(quantity);
//           }
//           console.log(productIds);
//           console.log(productQuantitys, "cantidad");
//           let canPurchase = true; // Variable para verificar si se puede comprar
        
//           for (let i = 0; i < productIds.length; i++) {
//             const productId = productIds[i];
//             const quantityToPurchase = productQuantitys[i];
    
//             const item = await product.getProductById(productId);
//             console.log(item, "productos");
            
//             if (item.stock < quantityToPurchase) {
//                 canPurchase = false;
//                 console.log("No hay suficiente stock para el producto:", item.title);
//                 outOfStockProductIds.push(productId);
//                 console.log(outOfStockProductIds, "outofstock");
               
//             } else {
//                 console.log("Hay stock suficiente para el producto:", item.title);
                
//                 item.stock -= quantityToPurchase; // Resta la cantidad que se va a comprar
//                 console.log(item.stock);
                
//                 await productModel.findByIdAndUpdate(
//                     { '_id': new mongoose.Types.ObjectId(productId) },
//                     { $set: { stock: item.stock } }
//                 );
//             }
//         }
      
//           return canPurchase;
//   } catch(err) {
//     console.log(err)
// }
//     }

// purchaseCart = async(cartId) => {
//     try {
//         // Obtén el carrito y su contenido
//         console.log("-----------------------------------------------");
//         let id;
//         let quantity;
//         const outOfStockProductIds = [];
//         const inStockProducts = [];
//         const productsPurchased = [];
//         const { products } = await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');
//         console.log(products, "cart data");
//         const productIds = [];
//         const productQuantitys = [];
        
//         for (const productItem of products) {
//             const producto = productItem.product;
//             quantity = productItem.quantity;
//             console.log(producto, "producto");
//             id = producto._id.toString();
//             productIds.push(id);
//             productQuantitys.push(quantity);
//         }
        
//         console.log(productIds);
//         console.log(productQuantitys, "cantidad");
        
//         for (let i = 0; i < productIds.length; i++) {
//             const productId = productIds[i];
//             const quantityToPurchase = productQuantitys[i];

//             const item = await product.getProductById(productId);
//             console.log(item, "productos");

//             if (item.stock < quantityToPurchase) {
//                 console.log("No hay suficiente stock para el producto:", item.title);
//                 outOfStockProductIds.push(productId);
//                 console.log(outOfStockProductIds, "outofstock");
//             } else {
//                 console.log("Hay stock suficiente para el producto:", item.title);
//                 inStockProducts.push({
//                     product: item,
//                     quantityToPurchase
//                 });
//             }
//         }

//         if (inStockProducts.length === 0) {
//             return false; // Ningún producto tiene stock suficiente
//         }
        
//         for (const inStockProduct of inStockProducts) {
//             const productId = inStockProduct.product._id.toString();
//             const quantityToPurchase = inStockProduct.quantityToPurchase;

//             const item = await product.getProductById(productId);
            
//             item.stock -= quantityToPurchase; // Resta la cantidad que se va a comprar
//             console.log(item.stock);
            
//             await productModel.findByIdAndUpdate(
//                 { '_id': new mongoose.Types.ObjectId(productId) },
//                 { $set: { stock: item.stock } }
//             );
//         }
        
//         return true; // Al menos un producto tiene stock suficiente
//     } catch(err) {
//         console.log(err);
//         return false;
//     }
// };
purchaseCart = async (cartId) => {
    try {
        // Obtén el carrito y su contenido
        console.log("-----------------------------------------------");
        let id;
        let quantity;
        const outOfStockProductIds = [];
        const inStockProducts = [];
        const { products } = await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');
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
        
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const quantityToPurchase = productQuantitys[i];

            const item = await product.getProductById(productId);
            console.log(item, "productos");

            if (item.stock < quantityToPurchase) {
                console.log("No hay suficiente stock para el producto:", item.title);
                outOfStockProductIds.push(productId);
                console.log(outOfStockProductIds, "outofstock");
            } else {
                console.log("Hay stock suficiente para el producto:", item.title);
                inStockProducts.push({
                    product: item,
                    quantityToPurchase
                });
                console.log(inStockProducts, "instockproducts");
            }
        }

        if (inStockProducts.length === 0) {
            return false; // Ningún producto tiene stock suficiente
        }
        
        let totalAmount = 0;
        const productsToRemoveFromCart = [];
        
        for (const inStockProduct of inStockProducts) {
            const productId = inStockProduct.product._id.toString();
            const quantityToPurchase = inStockProduct.quantityToPurchase;

            const item = await product.getProductById(productId);
            
            item.stock -= quantityToPurchase; // Resta la cantidad que se va a comprar
            totalAmount += item.price * quantityToPurchase; // Agrega al total amount
            productsToRemoveFromCart.push(productId); // Agrega el producto al array de productos a remover del carrito
          
            console.log(item.stock);
            
            await productModel.findByIdAndUpdate(
                { '_id': new mongoose.Types.ObjectId(productId) },
                { $set: { stock: item.stock } }
            );
        }
        
        // Elimina los productos comprados del carrito
        await cartModel.findByIdAndUpdate(
            { '_id': new mongoose.Types.ObjectId(cartId) },
            { $pull: { products: { product: { $in: productsToRemoveFromCart } } } }
        );
        
        // Actualiza el total amount del carrito si es necesario
        await cartModel.findByIdAndUpdate(
            { '_id': new mongoose.Types.ObjectId(cartId) },
            { $set: { totalAmount } }
        );
          console.log(totalAmount, "totalamount");
          console.log(inStockProducts, "instockproducts");
        return inStockProducts; // Al menos un producto tiene stock suficiente y se realizó la compra
    } catch(err) {
        console.log(err);
        return false;
    }
};








calculateTotalAmount = async (inStockProducts) => {
    console.log(inStockProducts, "isp");
    let totalAmount = 0;
    for (const inStockProduct of inStockProducts) {
        const product = inStockProduct.product;
        const quantity = inStockProduct.quantityToPurchase;
        totalAmount += product.price * quantity;
    }
    return totalAmount;
};

   generateUniqueCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
};

    purchaseCartWithTicket = async (cartId, userEmail, inStockProducts) => {
      try {
        //   const canPurchase = await this.purchaseCart(cartId);
          const inStockProducts = await this.purchaseCart(cartId);
          if (inStockProducts && inStockProducts.length > 0) {
              // Resta el stock y otras operaciones de compra aquí
  
              // Crear el ticket
              const cartData = await cartModel.findById(cartId).populate('products.product');
              const totalAmount = await this.calculateTotalAmount(inStockProducts);
              // const totalAmount = 10;
              const ticket = new ticketModel({
                  code: await this.generateUniqueCode(), // Implementar la función para generar códigos únicos
                  amount: totalAmount,
                  purchaser: userEmail,
              });
              await ticket.save();
  
              // Agregar el ID del ticket al carrito si es necesario
              await cartModel.findByIdAndUpdate(
                  { '_id': new mongoose.Types.ObjectId(cartId) },
                  { $set: { ticket: ticket._id } }
              );
  
              return true;
          } else {
              return false;
          }
      } catch(err) {
          console.log(err);
          return false;
      }
  };
    
  };
  

  
export default Carts;

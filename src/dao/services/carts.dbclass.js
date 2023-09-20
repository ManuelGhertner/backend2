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

      addCart = async(userId, userEmail) =>{
        try{
            // if (!Carts.#objEmpty(cart)) {
                // await cartModel.create({ ...cart, id: Carts.idUnico });
                const cartData = {
                    userId: userId,
                    email: userEmail
                }
                const cart = await cartModel.create(cartData);
                console.log(cart._id);
                await userModel.findByIdAndUpdate(
                    userId,
                    { $push: { cart: { carts: cart._id} } }
                );
                return cart._id;
                this.status = 1;
                this.statusMsg = "Carrito registrado en la base de datos";
            //   } else {
            //     this.status = -1;
            //     this.statusMsg = `Campos obligatorios incompletos`;
            //   }
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
                await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { $set: { email: user.email } });
                return result;
            }
        } catch(err) {
            return err;
        }
    }



































      

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

    // addCartAndAddProduct = async (cart, productId) => {
    //     try {
    //         // Verificar si el carrito existe
    //         let existingCart = await cartModel.findOne({ /* condición para buscar el carrito */ });
    
    //         if (!existingCart) {
    //             // Si el carrito no existe, crea uno nuevo
    //             const newCart = { /* datos para crear el carrito */ };
    //             existingCart = await cartModel.create(newCart);
    //         }
    
    //         // Ahora, agrega el producto al carrito existente
    //         let productsInCart = existingCart.products;
    //         let index = productsInCart.findIndex((p) => p.product._id == productId);
    
    //         if (index >= 0) {
    //             // Si el producto ya está en el carrito, aumenta la cantidad
    //             productsInCart[index].quantity++;
    //         } else {
    //             // Si el producto no está en el carrito, agrégalo
    //             productsInCart.push({ product: productId, quantity: 1 });
    //         }
    
    //         // Actualiza el carrito en la base de datos
    //         await cartModel.findByIdAndUpdate(existingCart._id, { products: productsInCart });
    
    //         this.status = 1;
    //         this.statusMsg = "Producto agregado al carrito con éxito.";
    //     } catch (err) {
    //         this.status = -1;
    //         this.statusMsg = `Error al agregar producto al carrito: ${err}`;
    //     }
    // };



    // createCartAndAddProduct = async (userId, productId) => {
    //     try {
    //         // Verificar si el usuario ya tiene un carrito
    //         const existingCart = await Carts.getCartByUserId(userId);
    
    //         if (!existingCart) {
    //             // Si no existe un carrito, crea uno nuevo y agrégale el producto
    //             const newCart = {
    //                 userId,
    //                 products: [{ product: productId, quantity: 1 }] // Agrega el primer producto al carrito
    //             };
    //             await Carts.addCart(newCart); // Supongamos que tienes una función para agregar un carrito
    
    //             return { success: true, message: "Carrito creado y producto agregado con éxito." };
    //         } else {
    //             // Si ya tiene un carrito, verifica si el producto ya está en el carrito
    //             const productInCart = existingCart.products.find(item => item.product == productId);
    
    //             if (productInCart) {
    //                 // Si el producto ya está en el carrito, aumenta la cantidad
    //                 productInCart.quantity++;
    //             } else {
    //                 // Si el producto no está en el carrito, agrégalo
    //                 existingCart.products.push({ product: productId, quantity: 1 });
    //             }
    
    //             await Carts.updateCart(existingCart); // Supongamos que tienes una función para actualizar el carrito
    
    //             return { success: true, message: "Producto agregado al carrito con éxito." };
    //         }
    //     } catch (err) {
    //         return { success: false, message: err.message };
    //     }
    // };


    

    // addProductToCart = async (cartId, productId, userId) => {
    //     try {
    //       // Obtén el carrito del usuario
    //       const cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartId) });
    //       const productsInCart = cart.products;
      
    //       // Verifica si el usuario es el propietario del producto
    //       const isOwner = await productModel.exists({ _id: new mongoose.Types.ObjectId(productId), owner: userId });
      
    //       if (isOwner) {
    //         // Si el usuario es propietario, no permitas agregarlo al carrito
    //         return { status: "Error", message: "No puedes agregar tu propio producto al carrito." };
    //       }
      
    //       // Verifica si el producto ya está en el carrito
    //       const index = productsInCart.findIndex((p) => p.product._id == productId);
    //       const obj = productsInCart[index];
      
    //       if (index >= 0) {
    //         obj.quantity++;
    //         productsInCart[index] = obj;
    //         const result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { products: productsInCart });
    //         return { status: "Success", message: "Producto agregado al carrito." };
    //       } else {
    //         const newObj = {
    //           product: productId,
    //           quantity: 1,
    //         };
      
    //         const result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { $push: { "products": newObj } });
    //         return { status: "Success", message: "Producto agregado al carrito." };
    //       }
    //     } catch (err) {
    //       return { status: "Error", message: "Error al agregar el producto al carrito." };
    //     }
    //   };

    // addProductToCart = async (cartId, productId, userId) => {
    //     try {
    //       // Busca el carrito por ID
    //       let cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartId) });
    
    //       // Si no existe un carrito con el ID proporcionado, crea uno nuevo
    //       if (!cart) {
    //         cart = await cartModel.create({ _id: cartId, products: [], email: '' });
    //       }
    
    //       const productsInCart = cart.products;
    
    //     //   // Verifica si el usuario es el propietario del producto
    //     //   const isOwner = await productModel.exists({ _id: new mongoose.Types.ObjectId(productId), owner: userId });
    
    //     //   if (isOwner) {
    //     //     // Si el usuario es propietario, no permitas agregarlo al carrito
    //     //     return { status: "Error", message: "No puedes agregar tu propio producto al carrito." };
    //     //   }
    
    //       // Verifica si el producto ya está en el carrito
    //       const index = productsInCart.findIndex((p) => p.product._id == productId);
    //       const obj = productsInCart[index];
    
    //       if (index >= 0) {
    //         obj.quantity++;
    //         productsInCart[index] = obj;
    //       } else {
    //         const newObj = {
    //           product: productId,
    //           quantity: 1,
    //         };
    //         productsInCart.push(newObj);
    //       }
    
    //       // Actualiza el carrito con los productos agregados
    //       const result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { $push: { "products": newObj } });
    
    //       return { status: "Success", message: "Producto agregado al carrito." };
    //     } catch (err) {
    //       return { status: "Error", message: "Error al agregar el producto al carrito." };
    //     }
    //   };

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

purchaseCart = async (cartId) => {
    try {
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

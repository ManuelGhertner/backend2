import mongoose from "mongoose";
import cartModel from "../models/carts.model.js";
import userModel from "../models/users.model.js";
import productModel from "../models/products.model.js";
import ProductsDB from "./products.dbclass.js";
import ticketModel from "../models/ticket.model.js";

const product = new ProductsDB();
class Carts {
  constructor() {
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
  }

  addCart = async (userId, userEmail) => {
    try {
      const cartData = {
        userId: userId,
        email: userEmail,
      };
      const cart = await cartModel.create(cartData);

      await userModel.findByIdAndUpdate(userId, {
        $push: { cart: { carts: cart._id } },
      });
      return cart._id;
      this.status = 1;
      this.statusMsg = "Carrito registrado en la base de datos";
    } catch (err) {
      this.status = -1;
      this.statusMsg = `addCart: ${err}`;
    }
  };

  addEmailToCart = async (cartId, userEmail) => {
    try {
      await cartModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $set: { email: userEmail } }
      );
    } catch (err) {
      return err;
    }
  };

  addCartToUser = async (userId, cartId) => {
    try {
      let user = await userModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      let cart = await cartModel.findOne({
        _id: new mongoose.Types.ObjectId(cartId),
      });

      let carts = user.cart;

      let index = carts.findIndex((c) => c.carts._id == cartId);

      if (index >= 0) {
        return "Cart already exists for this user.";
      } else {
        let newCart = {
          carts: cart,
        };

        let result = await userModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(userId) },
          { $push: { cart: newCart } }
        );
        await cartModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(cartId) },
          { $set: { email: user.email } }
        );
        return result;
      }
    } catch (err) {
      return err;
    }
  };

  addEmailToCart = async (cartId, userEmail) => {
    try {
      await cartModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $set: { email: userEmail } }
      );
    } catch (err) {
      return err;
    }
  };

  getCarts = async () => {
    try {
      const data = await cartModel.find().lean().populate("products.product");
      return data;
    } catch (err) {
      return err;
    }
  };

  getCartById = async (cartId) => {
    try {
      return await cartModel
        .findById({ _id: new mongoose.Types.ObjectId(cartId) })
        .lean()
        .populate("products.product");
    } catch (err) {
      console.log(err);
    }
  };

  getCartByUserId = async (userId) => {
    try {
      const user = await userModel.findById(userId).lean();
      if (!user) {
        return null;
      }

      const cartIdArray = user.cart.map((cartObj) => cartObj.carts);
      const firstCartId = cartIdArray[0];

      const cartData = await cartModel
        .findById(firstCartId)
        .lean()
        .populate("products.product");

      return cartData;
    } catch (err) {
      throw err;
    }
  };

  addProductToCart = async (cartId, productId) => {
    try {
      let cart = await cartModel.findOne({
        _id: new mongoose.Types.ObjectId(cartId),
      });
      let productsInCart = cart.products;
      let index = productsInCart.findIndex((p) => p.product._id == productId);
      let obj = productsInCart[index];

      if (index >= 0) {
        obj.quantity++;
        productsInCart[index] = obj;
        let result = await cartModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(cartId) },
          { products: productsInCart }
        );
        return result;
      } else {
        let newObj = {
          product: productId,
          quantity: 1,
        };

        let result = await cartModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(cartId) },
          { $push: { products: newObj } }
        );
        return result;
      }
    } catch (err) {
      return err;
    }
  };

  deleteCart = async (cartId) => {
    try {
      const newData = await cartModel.deleteOne({ _id: cartId });
      return newData;
    } catch (err) {
      return err;
    }
  };

  getCartById = async (cartId) => {
    try {
      return await cartModel
        .findById({ _id: new mongoose.Types.ObjectId(cartId) })
        .lean()
        .populate("products.product");
    } catch (err) {
      console.log(err);
    }
  };

  purchaseCart = async (cartId) => {
    try {
      let id;
      let quantity;
      const outOfStockProductIds = [];
      const inStockProducts = [];
      const { products } = await cartModel
        .findById({ _id: new mongoose.Types.ObjectId(cartId) })
        .lean()
        .populate("products.product");
      console.log(products, "cart data");
      const productIds = [];
      const productQuantitys = [];

      for (const productItem of products) {
        const producto = productItem.product;
        quantity = productItem.quantity;

        id = producto._id.toString();
        productIds.push(id);
        productQuantitys.push(quantity);
      }

      for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        const quantityToPurchase = productQuantitys[i];

        const item = await product.getProductById(productId);

        if (item.stock < quantityToPurchase) {
          outOfStockProductIds.push(productId);
        } else {
          console.log("Hay stock suficiente para el producto:", item.title);
          inStockProducts.push({
            product: item,
            quantityToPurchase,
          });
          console.log(inStockProducts, "instockproducts");
        }
      }

      if (inStockProducts.length === 0) {
        return false;
      }

      let totalAmount = 0;
      const productsToRemoveFromCart = [];

      for (const inStockProduct of inStockProducts) {
        const productId = inStockProduct.product._id.toString();
        const quantityToPurchase = inStockProduct.quantityToPurchase;

        const item = await product.getProductById(productId);

        item.stock -= quantityToPurchase;
        totalAmount += item.price * quantityToPurchase;
        productsToRemoveFromCart.push(productId);

        await productModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(productId) },
          { $set: { stock: item.stock } }
        );
      }

      await cartModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $pull: { products: { product: { $in: productsToRemoveFromCart } } } }
      );

      await cartModel.findByIdAndUpdate(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $set: { totalAmount } }
      );

      return inStockProducts;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  calculateTotalAmount = async (inStockProducts) => {
    let totalAmount = 0;
    for (const inStockProduct of inStockProducts) {
      const product = inStockProduct.product;
      const quantity = inStockProduct.quantityToPurchase;
      totalAmount += product.price * quantity;
    }
    return totalAmount;
  };

  generateUniqueCode = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 8;
    let code = "";

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  };

  purchaseCartWithTicket = async (cartId, userEmail, inStockProducts) => {
    try {
      const inStockProducts = await this.purchaseCart(cartId);
      if (inStockProducts && inStockProducts.length > 0) {
        const cartData = await cartModel
          .findById(cartId)
          .populate("products.product");
        const totalAmount = await this.calculateTotalAmount(inStockProducts);

        const ticket = new ticketModel({
          code: await this.generateUniqueCode(),
          amount: totalAmount,
          purchaser: userEmail,
        });
        await ticket.save();

        await cartModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(cartId) },
          { $set: { ticket: ticket._id } }
        );

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  getTickets = async () => {
    try {
      const tickets = await ticketModel.find().lean();
      return tickets;
    } catch (err) {
      console.log(err);
        return false;
    }
  };
}



export default Carts;

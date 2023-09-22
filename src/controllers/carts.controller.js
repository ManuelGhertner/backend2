import Carts from "../dao/services/carts.dbclass.js";
import ProductsDB from "../dao/services/products.dbclass.js";
import Users from "../dao/services/users.dbclass.js";
import CustomError from "../dao/services/customError.js";
import errorsDict from "../dictionary.js";

const cart = new Carts();
const product = new ProductsDB();
const usuario = new Users();


export const createCart = async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const loggedInUser = req.session.user;
    const userEmail = loggedInUser.email;
    const result = await cart.addCart(userId, userEmail);
    if (userId) {
      res.status(200).send({ status: "ok", message: "Carrito creado" });
    } else {
        throw new CustomError(errorsDict.NOT_FOUND_ERROR);
    }
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getCarts = async (req, res, next) => {
  try {
    const carts = await cart.getCarts();
    res.status(200).send({ status: "ok", carts });
  } catch (err) {
    throw new CustomError(errorsDict.NOT_FOUND_ERROR);
  }
};

export const addProductToCart = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const loggedInUser = req.session.user;
    const user = await usuario.getUsersById(loggedInUser.id);
    const idHex = user.cart[0].carts._id.toString();

    if (!idHex) {
      return res
        .status(500)
        .send({
          status: "error",
          message: "El usuario no tiene un carrito asignado.",
        });
    }

    const result = await cart.addProductToCart(idHex, pid);

    if (result) {
      res
        .status(200)
        .send({
          status: "ok",
          message: "Producto agregado al carrito con éxito.",
        });
    } else {
        throw new CustomError(errorsDict.INTERNAL_ERROR);
    }
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const deleteCart = async (req, res, next) => {
  const { cid } = req.params;

  try {
    const data = await cart.deleteCart(cid);
    res.status(200).send({ status: "ok", message: "Carrito eliminado", data });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { cid, pid } = req.params;

  try {
    const data = await cart.deleteProductInCart(cid, pid);

    res
      .status(200)
      .send({ status: "ok", message: "Producto eliminado del carrito", data });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const updateProductQuantity = async (req, res, next) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const data = await cart.updateProductQuantity(cid, pid, quantity);
    res
      .status(200)
      .send({ status: "ok", message: "Producto actualizado", data });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const deleteAllProducts = async (req, res, next) => {
  const { cid } = req.params;

  try {
    await cart.deleteAllProducts(cid);
    res
      .status(200)
      .send({ status: "ok", message: "Productos del carrito eliminado" });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getCartById = async (req, res, next) => {
  const { cid } = req.params;

  try {
    const data = await cart.getCartById(cid);
    const idHex = data._id.toString();
    if (cid === idHex) {
      res.status(200).send({ message: "Carrito encontrado.", data: data });
      console.log(carrito);
    } else {
        throw new CustomError(errorsDict.NOT_FOUND_ERROR);
    }
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getCartByUserId = async (req, res, next) => {
  const { cid } = req.params;

  try {
    const cartData = await cart.getCartByUserId(cid);

    if (cartData) {
      res.status(200).send({ message: "Carrito encontrado.", data: cartData });
    } else {
        throw new CustomError(errorsDict.NOT_FOUND_ERROR);
    }
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const addEmailToCart = async (req, res, next) => {
  try {
    const cartId = req.params.pid;
    const loggedInUser = req.session.user;
    const userEmail = loggedInUser.email;
    await cart.addEmailToCart(cartId, userEmail);


    if (!cartId) {
        throw new CustomError(errorsDict.NOT_FOUND_ERROR);
    }

    return res
      .status(200)
      .json({
        status: "ok",
        message: "Correo electrónico agregado al carrito",
      });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
};
}

export const purchaseCart = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cartData = await cart.getCartById(cartId);
    const userEmail = cartData.email;

    const successfulPurchase = await cart.purchaseCartWithTicket(
      cartId,
      userEmail
    );

    if (successfulPurchase) {
      res.status(200).json({ message: "Compra exitosa" });
    } else {
        throw new CustomError(errorsDict.ROUTING_ERROR);
    }
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

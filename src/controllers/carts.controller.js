import Carts from "../dao/services/carts.dbclass.js";
import ProductsDB from "../dao/services/products.dbclass.js";
import Users from "../dao/services/users.dbclass.js";

const cart = new Carts();
const product = new ProductsDB();
const usuario = new Users();


export const createCart = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const loggedInUser = req.session.user;
    const userEmail = loggedInUser.email;
    const result = await cart.addCart(userId, userEmail);
    console.log(userId);
    if (userId) {
      res.status(200).send({ status: "ok", message: "Carrito creado" });
    } else {
      res.status(500).send({ status: "error", message: result.statusMsg });
    }
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const getCarts = async (req, res) => {
  try {
    const carts = await cart.getCarts();
    res.status(200).send({ status: "ok", carts });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { pid } = req.params;
    const loggedInUser = req.session.user;
    console.log(loggedInUser.id);
    const user = await usuario.getUsersById(loggedInUser.id);
    console.log(user.cart[0].carts);
    const idHex = user.cart[0].carts._id.toString();
    console.log(idHex);

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
      res.status(500).send({ status: "error", message: result.message });
    }
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const deleteCart = async (req, res) => {
  const { cid } = req.params;

  try {
    const data = await cart.deleteCart(cid);
    res.status(200).send({ status: "ok", message: "Carrito eliminado", data });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const data = await cart.deleteProductInCart(cid, pid);

    res
      .status(200)
      .send({ status: "ok", message: "Producto eliminado del carrito", data });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const data = await cart.updateProductQuantity(cid, pid, quantity);
    res
      .status(200)
      .send({ status: "ok", message: "Producto actualizado", data });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const deleteAllProducts = async (req, res) => {
  const { cid } = req.params;

  try {
    await cart.deleteAllProducts(cid);
    res
      .status(200)
      .send({ status: "ok", message: "Productos del carrito eliminado" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const getCartById = async (req, res) => {
  const { cid } = req.params;

  try {
    const data = await cart.getCartById(cid);
    const idHex = data._id.toString();
    if (cid === idHex) {
      res.status(200).send({ message: "Carrito encontrado.", data: data });
      console.log(carrito);
    } else {
      res
        .status(400)
        .send({ status: "error", message: "Carrito no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const getCartByUserId = async (req, res) => {
  const { cid } = req.params;

  try {
    const cartData = await cart.getCartByUserId(cid);

    if (cartData) {
      res.status(200).send({ message: "Carrito encontrado.", data: cartData });
    } else {
      res
        .status(400)
        .send({ status: "error", message: "Carrito no encontrado" });
    }
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const addEmailToCart = async (req, res) => {
  try {
    const cartId = req.params.pid;
    const loggedInUser = req.session.user;
    const userEmail = loggedInUser.email;
    await cart.addEmailToCart(cartId, userEmail);
    console.log(userEmail);
    console.log(cartId);

    if (!cartId) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    return res
      .status(200)
      .json({
        status: "ok",
        message: "Correo electrónico agregado al carrito",
      });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

export const purchaseCart = async (req, res) => {
  const cartId = req.params.cid;
  console.log(cartId, "cartId");

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
      res.status(400).json({ message: "No se pudo completar la compra" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

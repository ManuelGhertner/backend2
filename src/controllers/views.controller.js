import ProductsDB from "../dao/services/products.dbclass.js";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import { generateToken } from "../utils.js";
import { store } from "../utils.js";
import Carts from "../dao/services/carts.dbclass.js";
import Users from "../dao/services/users.dbclass.js";
import userModel from "../dao/models/users.model.js";
import CustomError from "../dao/services/customError.js";
import errorsDict from "../dictionary.js";

const products = new ProductsDB();
const carts = new Carts();
const users = new Users();

export const realTimeProducts = async (req, res, next) => {
  const currentProducts = await productModel.find().lean();
  res.render("realTimeProducts", { products: currentProducts });
};

export const addProducts = async (req, res, next) => {
  res.render("productsCreator");
};

export const getProducts = async (req, res, next) => {
  try {
    const loggedInUser = req.session.user;
    if (!loggedInUser) {
        throw new CustomError(errorsDict.PERMIT_ERROR);
    }

    const currentProducts = await productModel
      .find({ owner: loggedInUser.id })
      .lean();

    res.render("productsOwned", { products: currentProducts });
  } catch (error) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await userModel.find().lean();

    res.render("users", { users: allUsers });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const allProducts = await productModel.find().lean();

    res.render("productsOwned", { products: allProducts });
  } catch (error) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const register = async (req, res, next) => {
  if (req.session.userValidated === true) {
    res.redirect("/");
  } else {
    res.render("register", { errorMessages: req.session.errorMessages });
  }
};

export const profile = async (req, res, next) => {
  //datos de usuario.
  const user = req.session.user;
  res.render("profile", { user: user });
};

export const login = async (req, res, next) => {
  req.sessionStore.userValidated = req.session.userValidated = true;
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    role: req.user.role,
    id: req.user._id,
  };
  const accessToken = generateToken(req.session.user);
  console.log(accessToken);
  res.cookie("accessToken", accessToken, { httpOnly: true });

  res.redirect("/");
};

export const cart = async (req, res, next) => {
  try {
    res.render("carts");
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const renderizarCarritoUsuario = async (req, res, next) => {
  try {
    const cid = req.params.cid;

    const carrito = await carts.getCartByUserId(cid);
    console.log(carrito);

    res.render("carts", { carrito });
  } catch (error) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const verifySession = async (req, res, next) => {
  store.get(req.sessionID, async (err, data) => {
    if (err) console.log(`Error al obtener el usuario: ${err}`);

    if (data !== null && req.session.userValidated) {
      let limit = parseInt(req.query.limit) || 10;
      let category = req.query.category || "";
      let sort = req.query.sort?.toString() || "";
      let page = parseInt(req.query.page) || 1;
      let status = req.query.status || "";

      const data = await products.getProducts(
        limit,
        page,
        sort,
        category,
        status
      );

      const user = req.session.user;

      res.status(200).render("home", { products: data, user: user });
    } else {
      res.render("login", {
        sessionInfo: data,
        errorMessages: req.session.errorMessages,
      });
    }
  });
};

export const logout = async (req, res, next) => {
  req.session.userValidated = false;

  req.session.destroy((err) => {
    req.sessionStore.destroy(req.sessionID, (err) => {
      if (err) console.log(`Error al cerrar sesion: ${err}`);

      console.log("Sesion cerrada");
      res.redirect("/");
    });
  });
};

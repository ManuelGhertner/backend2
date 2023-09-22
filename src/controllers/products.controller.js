import factoryProduct from "../dao/services/factory.js"
import CustomError from "../dao/services/customError.js";
import errorsDict from "../dictionary.js";
const product = new factoryProduct("../src/db/products.json");
import nodemailer from "nodemailer";
import Users from "../dao/services/users.dbclass.js";
const usuario = new Users();

export const addProducts = async (req, res, next) => {
  try {
    const productData = req.body;
    const loggedInUser = req.session.user;
    productData.owner = loggedInUser.id; // ESTA LINEA Y LAS DOS SUPERIORES DEBEN SER COMENTADAS PARA QUE CORRA EL TEST POR TEMAS DE LOGUEO
    await product.addProduct(req.body);
    const status = product.status;
    if (product.status === 1) {
      res.status(200).send({ status: "Success", product });
    } else {
      throw new CustomError(errorsDict.INVALID_TYPE_ERROR);
    }
  } catch (err) {
    req.logger.error(
      `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
    );
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const producto = await product.getProductById(pid);
    if (producto) {
      res.status(200).send({ status: "Sucess", producto });
    } else {
        throw new CustomError(errorsDict.INVALID_TYPE_ERROR);
    }
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getProducts = async (req, res, next) => {
  const { limit, page, sort, category, status } = req.query;

  try {
    let products = await product.getProducts(
      limit,
      page,
      sort,
      category,
      status
    );
    res.status(200).send(products);
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getProductsFromUser = async (req, res, next) => {
  const { limit, page, sort, category, status } = req.query;
  const loggedInUser = req.session.user;

  try {
    if (loggedInUser) {
      let products = await product.getProductsByOwner(
        limit,
        page,
        sort,
        category,
        status,
        loggedInUser.id
      );
      res.status(200).send(products);
    } else {
        throw new CustomError(errorsDict.PERMIT_ERROR);
    }
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const id = await product.getProductById(pid);
    const producto = await product.updateProduct(pid, req.body);
    const idHex = id._id.toString();
    if (pid === idHex) {
      res.status(200).send({ status: "success", producto });
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

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "manuelghertner@gmail.com",
    pass: "mfxomsbkbifbxgzu", // pasarlo al .env
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const deleteProduct = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    const producto = await product.getProductById(pid);
    const uid = producto.owner;
    const deletedProduct = await product.deleteProduct(pid);
    const user = await usuario.getUsersById(uid);
    const premium = user.role;

    if (user.role == "premium") {
      await transport.sendMail({
        from: "Ecommerce <manuelghertner@gmail.com>",
        to: user.email,
        subject: "Producto eliminado",
        text: `El producto con ID ${pid} ha sido eliminado.`,
        attachments: [],
      });
    }

    if (!deletedProduct) {
        throw new CustomError(errorsDict.NOT_FOUND_ERROR);
    }
    res.status(200).send({ status: "OK", msg: "Producto eliminado" });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

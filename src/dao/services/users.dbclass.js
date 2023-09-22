import userModel from "../models/users.model.js";
import mongoose from "mongoose";
import { createHash } from "../../utils.js";
import cartModel from "../models/carts.model.js";
import moment from "moment";

class Users {
  constructor() {
    this.status = 0;
    this.statusMsg = "Initialized";
  }

  static requiredFields = ["firsName", "lastName", "email", "age", "password"];

  static #verifyRequiredFields = (obj) => {
    return Users.requiredFields.every(
      (field) => obj.hasOwnProperty.call(obj, field) && obj[field] !== null
    );
  };

  static #objEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  showStatusMsg = () => {
    return this.statusMsg;
  };

  addUser = async (user) => {
    try {
      if (!Users.#objEmpty(user)) {
        user.password = createHash(user.password);
        const process = await userModel.create(user);
        this.status = 1;
        this.statusMsg = "Usuario registrado en BBDD";
      } else {
        this.status = -1;
        this.statusMsg = "Faltan campos requeridos";
      }
    } catch (err) {
      this.status = -1;
      this.statusMsg = ` AddUser: ${err}`;
    }
  };

  getUsers = async () => {
    try {
      const users = await userModel.find().populate("cart").lean();
      this.statusMsg = "Usuarios obtenidos con exito";
      return users;
    } catch (err) {
      this.statusMsg = `getUsers: ${err.message}`;
    }
  };

  getUsersById = async (id) => {
    try {
      const users = await userModel
        .findById({ _id: new mongoose.Types.ObjectId(id) })
        .lean();
      return users;
    } catch (err) {
      this.status = -1;
      this.statusMsg = `getUserById : ${err}`;
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

  lastLogin = async () => {
    try {
      const twoDaysAgo = moment().subtract(2, "days");
      const inactiveUsers = await userModel.find({
        lastLogin: { $lt: twoDaysAgo.toDate() },
      });

      await userModel.deleteMany({
        _id: { $in: inactiveUsers.map((user) => user._id) },
      });

      return inactiveUsers;
    } catch (err) {
      console.log(err);
    }
  };

  deleteUsers = async (id) => {
    try {
      const deleter = await userModel.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      deleter.deletedCount === 0
        ? console.log("El ID no existe")
        : console.log("Usuario eliminado");
    } catch (err) {
      return err;
    }
  };

  updateUserRole = async (userId, newRole) => {
    try {
      const updateUser = await userModel.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
      );
      return updateUser;
    } catch (err) {
      throw err;
    }
  };
}

export default Users;

import Users from "../dao/services/users.dbclass.js";
import nodemailer from "nodemailer";
import CustomError from "../dao/services/customError.js";
import errorsDict from "../dictionary.js";
const user = new Users();

export const createUser = async (req, res, next) => {
  try {
    const data = await user.addUser(req.body);
    console.log(data);
    res.status(200).send({ status: "ok", message: `USER creado`, data });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await user.getUsers();
    res.status(200).send({ status: "ok", users });
    console.log(users);
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const addCartToUser = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    user.addCartToUser(cid, pid);
    res
      .status(200)
      .send({ status: "ok", message: "Carrito agregado al usuario" });
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

export const getUsersInactiveForTwoDays = async (req, res, next) => {
  try {
    const inactiveUsers = await user.lastLogin();

    for (const user of inactiveUsers) {
      await transport.sendMail({
        from: "Ecommerce <manuelghertner@gmail.com>",
        to: user.email,
        subject: "Cuenta eliminada por inactividad",
        html: `
                    <h1>Tu cuenta ha sido eliminada</h1>
                    <p>Tu cuenta ha sido eliminada debido a la inactividad durante los últimos 2 dias.</p>
                `,
        attachments: [],
      });
    }

    res
      .status(200)
      .json({
        message: "Usuarios inactivos en los últimos 2 dias",
        data: inactiveUsers,
      });
  } catch (error) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const pid = req.params.pid;
    await user.deleteUsers(pid);
    res.status(200).send({ status: "OK", msg: "Usuario eliminado" });
  } catch (err) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

export const updateUserRoleController = async (req, res, next) => {
  const { pid } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await user.updateUserRole(pid, role);

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Rol de usuario actualizado", user: updatedUser });
  } catch (error) {
    req.logger.error(
        `${req.method} ${req.url} ${new Date().toLocaleTimeString()}`
      );
      next(err);
  }
};

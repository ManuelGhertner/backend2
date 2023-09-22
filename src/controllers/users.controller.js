import Users from "../dao/services/users.dbclass.js";
import nodemailer from "nodemailer";
const user = new Users();

export const createUser = async (req, res) => {
  try {
    const data = await user.addUser(req.body);
    console.log(data);
    res.status(200).send({ status: "ok", message: `USER creado`, data });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await user.getUsers();
    res.status(200).send({ status: "ok", users });
    console.log(users);
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const addCartToUser = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    user.addCartToUser(cid, pid);
    res
      .status(200)
      .send({ status: "ok", message: "Carrito agregado al usuario" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
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

export const getUsersInactiveForTwoDays = async (req, res) => {
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
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener usuarios inactivos",
        error: error.message,
      });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const pid = req.params.pid;
    await user.deleteUsers(pid);
    res.status(200).send({ status: "OK", msg: "Usuario eliminado" });
  } catch (err) {
    res.status(500).send({ status: "Error", error: err });
  }
};

export const updateUserRoleController = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Error al actualizar el rol", error: error.message });
  }
};

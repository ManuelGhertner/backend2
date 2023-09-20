import Users from "../dao/services/users.dbclass.js";

const user = new Users();

// CREAR USUARIO

export const createUser = async(req, res) =>{
    try{
        const data = await user.addUser(req.body);
        console.log(data);
        res.status(200).send({ status:  "ok",  message: `USER creado`, data  });
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
};

export const getUsers = async(req, res) => {
    try {
        const users = await user.getUsers()
        res.status(200).send({ status: "ok", users })
        console.log(users);
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
};

// Agregar carrito al usuario.
export const addCartToUser = async(req, res) => {
    try {
        const { cid, pid } = req.params;
  
        user.addCartToUser(cid, pid);//agrego el producto al carrito.;
        res.status(200).send({ status: "ok", message: "Carrito agregado al usuario" });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
};

export const getUsersInactiveForTwoDays = async (req, res) => {
    try {
        const inactiveUsers = await user.lastLogin();

        // En este punto, 'inactiveUsers' contiene los usuarios inactivos.
        // Puedes realizar cualquier acción adicional, como enviar un correo electrónico a los usuarios inactivos.

        res.status(200).json({ message: 'Usuarios inactivos en los últimos 2 minutos', data: inactiveUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios inactivos', error: error.message });
    }
};


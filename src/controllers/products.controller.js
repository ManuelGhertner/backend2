import factoryProduct from "../dao/services/factory.js";
import CustomError from "../dao/services/customError.js";
import errorsDict from "../dictionary.js";
import { addLogger } from "../dao/services/logger.service.js";
const product = new factoryProduct("../src/db/products.json");
import nodemailer from "nodemailer";
import Users from "../dao/services/users.dbclass.js";
const usuario = new Users();


// AGREGAR PRODUCTOS

export const addProducts = async (req, res, next) =>{
    try{
        const productData = req.body;
        const loggedInUser = req.session.user;
        productData.owner = loggedInUser.id; // ESTA LINEA Y LAS DOS SUPERIORES DEBEN SER COMENTADAS PARA QUE CORRA EL TEST.
        await product.addProduct(req.body);
        const status = product.status;
        if(product.status === 1){
            res.status(200).send({ status: "Success", product});
        } else {
            throw new CustomError(errorsDict.INVALID_TYPE_ERROR);
        };
    } catch (err){
        req.logger.error(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`)
        next(err);
    };
};

// OBTENER PRODUCTO POR ID
 
export const getById = async (req, res) =>{
    try {
        const pid = req.params.pid;
        const producto = await product.getProductById(pid);
        if(producto){
            res.status(200).send({status: "Sucess", producto});
        } else{
            res.status(400).send({status: "Error404"})
        };
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    };
};

// OBTENER PRODUCTOS

export const getProducts = async (req, res) =>{
    const{limit, page, sort, category , status} = req.query;

    try{
        let products = await product.getProducts(limit, page, sort, category, status);
        res.status(200).send(products);
    } catch(err){
        res.status(500).send(err.message)
    };
};


// OBTENER PRODUCTOS CREADOS POR EL USUARIO

export const getProductsFromUser = async (req, res) => {
    const { limit, page, sort, category, status } = req.query;
    const loggedInUser = req.session.user; // Obtén el usuario de la sesión
  
    try {
      if (loggedInUser) {
        // Si hay un usuario logueado
        let products = await product.getProductsByOwner(limit, page, sort, category, status, loggedInUser.id);
        res.status(200).send(products);
      } else {
        // Si no hay un usuario logueado
        res.status(401).send("Debes iniciar sesión para acceder a esta función.");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
// ACTUALIZAR PRODUCTOS

export const updateProduct = async (req, res) => {
    try{
        const pid = req.params.pid;
        const id = await product.getProductById(pid);
        const producto = await product.updateProduct(pid, req.body);
        const idHex = id._id.toString();
        if(pid === idHex){
            res.status(200).send({ status: "success", producto })
        } else {
            res.status(400).send({status: "Error404"})
        }
       
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
};

// ELIMINAR PRODUCTOS


const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: "manuelghertner@gmail.com",
        pass: "mfxomsbkbifbxgzu" // pasarlo al .env
    },
    tls: {
        rejectUnauthorized: false // Omitir la verificación del certificado SSL
    }
})

// export const deleteProduct = async (req, res) =>{
//     try{
//         const pid = req.params.pid;
//         await product.deleteProduct(pid);
//         res.status(200).send({ status: "OK", msg: "Producto eliminado"});
//     } catch (err){
//         res.status(500).send({ status: "Error", error: err})
//     };
// };

export const deleteProduct = async (req, res) => {
    try {
      const pid = req.params.pid;
      const producto = await product.getProductById(pid);
      const uid = producto.owner;
      console.log(uid);
      const deletedProduct = await product.deleteProduct(pid);
      console.log(producto);
      const user = await usuario.getUsersById(uid)
      console.log(user);
      const premium = user.role;
      console.log(premium);
      console.log(user.email);
     
  
     
  
      if (user.role == 'premium') {
        // El usuario es premium, enviar un correo electrónico de notificación  
        await transport.sendMail({
            from: 'Ecommerce <manuelghertner@gmail.com>',
            to: user.email,
            subject: 'Producto eliminado',
            text: `El producto con ID ${pid} ha sido eliminado.`,
            attachments: []
        });
          }
        // await transport.sendMail({
        //     from: "Ecommerce <manuelghertner@gmail.com>",
        //     to: user.email,
        //     subject: "Cuenta eliminada por inactividad",
        //     html: `
        //         <h1>Tu cuenta ha sido eliminada</h1>
        //         <p>Tu cuenta ha sido eliminada debido a la inactividad durante los últimos 2 dias.</p>
        //     `,
        //     attachments: []
        // });
    //   }
    if (!deletedProduct) {
        return res.status(404).send({ status: 'Error', msg: 'Producto no encontrado' });
      }
      res.status(200).send({ status: 'OK', msg: 'Producto eliminado' });
    } catch (err) {
      console.error(err);
      res.status(500).send({ status: 'Error', error: err });
    }
  };
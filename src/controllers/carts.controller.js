import Carts from "../dao/services/carts.dbclass.js";
import ProductsDB from "../dao/services/products.dbclass.js";
import Users from "../dao/services/users.dbclass.js";

const cart = new Carts();
const product = new ProductsDB();
const usuario = new Users();

// Crear carrito.
export const createCart = async(req, res) => {
    try {
    //     const data = await cart.addCart(req.body);
    //     res.status(200).send({ status:  "ok",  message: `Carrito creado`, data  });
    // } catch(err) {
    //     res.status(500).send({ status: "error", message: err.message });
    // }
    
// Obtén el ID del usuario loggeado (asumiendo que está en req.session.user.id)
const userId = req.session.user.id;
const loggedInUser = req.session.user; 
const userEmail = loggedInUser.email;
// Llama a la función addCart del servicio de carritos con el ID del usuario
const result = await cart.addCart(userId, userEmail);
console.log(userId);
if (userId) {
    // Carrito creado con éxito
    res.status(200).send({ status: "ok", message: "Carrito creado"});
} else {
    // Error al crear el carrito
    res.status(500).send({ status: "error", message: result.statusMsg });
}
} catch (err) {
res.status(500).send({ status: "error", message: err.message });
};
    }



// Obtener carritos.
export const getCarts = async(req, res) => {
    try {
        const carts = await cart.getCarts()
        res.status(200).send({ status: "ok", carts })
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
};

// Agregar producto al carrito.
// export const addProductToCart = async(req, res) => {
//     try {
//         const { cid, pid } = req.params;
  
//         cart.addProductToCart(cid, pid);//agrego el producto al carrito.;
//         res.status(200).send({ status: "ok", message: "Producto agregado al carrito" });

//     } catch(err) {
//         res.status(500).send({ status: "error", message: err.message });
//     }
// };

export const addProductToCart = async (req, res) => {
    try {
        const { pid } = req.params; // Obtén el ID del producto desde los parámetros
        const loggedInUser = req.session.user; // Obtén el usuario logueado
console.log(loggedInUser.id);
const user = await usuario.getUsersById(loggedInUser.id)
console.log(user.cart[0].carts);
const idHex = user.cart[0].carts._id.toString();
console.log(idHex);
        // Asegúrate de que el usuario tenga un carrito asignado
        if (!idHex) {
            return res.status(500).send({ status: "error", message: "El usuario no tiene un carrito asignado." });
        }

        // // Obtén el ID del carrito del usuario
        // const cartId = loggedInUser.cart._id;

        // Llama a la función que agrega el producto al carrito usando cartId
        const result = await cart.addProductToCart(idHex, pid);

        if (result) {
            res.status(200).send({ status: "ok", message: "Producto agregado al carrito con éxito." });
        } else {
            res.status(500).send({ status: "error", message: result.message });
        }
    } catch (err) {
        res.status(500).send({ status: "error", message: err.message });
    }
};

// export const createCartAndAddProduct = async (req, res) => {
//     try {
//         const { productId } = req.body; // Asegúrate de que esta propiedad coincida con la que esperas en la solicitud

//         // Verifica si el producto existe
//         const producto = await product.findById(productId);
//         if (!producto) {
//             return res.status(404).send({ status: "error", message: "El producto no existe." });
//         }

//         // Crea un objeto de carrito con el producto
//         const cart = {
//             userId: req.session.user.id, // Supongamos que puedes obtener el ID del usuario de la sesión
//             products: [{ producto: productId, quantity: 1 }]
//         };

//         // Llama a la función para crear un carrito y agregar el producto
//         await cart.addCartAndAddProduct(cart, productId);

//         res.status(200).send({ status: "ok", message: "Carrito creado y producto agregado con éxito." });
//     } catch (err) {
//         res.status(500).send({ status: "error", message: err.message });
//     }
// };




// export const createCartAndAddProduct = async (req, res) => {
//     try {
//         const { pid } = req.params; 
//         const loggedInUser = req.session.user;// Obtener el ID del producto desde los parámetros
//         // const userId = req.user._id; // Supongamos que tienes información del usuario en req.user

//         const result = await createCartAndAddProduct(pid, loggedInUser.id);

//         if (result) {
//             res.status(200).send({ message: "Exitoso" });
//         } else {
//             res.status(500).send({ status: "error!!", message: result.message });
//         }
//     } catch (err) {
//         res.status(500).send({ status: "errorrrr", message: err.message });
//     }
// };

// export const addProductToCart = async(req, res) => {
//     try {
//         const { cid } = req.params; // Obtén el ID del carrito desde los parámetros de la URL
//         const { productId } = req.body; // Obtén el ID del producto desde el cuerpo de la solicitud
//         console.log(productId);
//         console.log("hola");
//         // Llama a la función para agregar el producto al carrito
//         const result = await cart.addProductToCart(cid, productId);

//         if (result.status === "Success") {
//             res.status(200).send({ status: "ok", message: "Producto agregado al carrito" });
//         } else {
//             res.status(400).send({ status: "error", message: result.message });
//         }
//     } catch(err) {
//         res.status(500).send({ status: "error", message: err.message });
//     }
// };

// Borrar carrito.
export const deleteCart = async(req, res) => {
    const { cid } = req.params;

    try {
        const data = await cart.deleteCart(cid);
        res.status(200).send({ status: "ok", message: "Carrito eliminado", data });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
};

// Borrar producto del carrito.
export const deleteProduct = async(req, res) => {
    const { cid, pid } = req.params;

    try {
        const data = await cart.deleteProductInCart(cid, pid);

        res.status(200).send({ status: "ok", message: "Producto eliminado del carrito", data });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
};

// Update cantidad.
export const updateProductQuantity = async(req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const data = await cart.updateProductQuantity(cid, pid, quantity);
        res.status(200).send({ status: "ok", message: "Producto actualizado", data });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
};

// Borrar todos los productos del carrito.
export const deleteAllProducts = async(req, res) => {
    const { cid } = req.params;

    try{
        await cart.deleteAllProducts(cid);
        res.status(200).send({ status: "ok", message: "Productos del carrito eliminado" });   

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
};

// Obtener carrito por id.
export const getCartById = async(req, res) => {
    const { cid } = req.params;
    

    try {
        const data = await cart.getCartById(cid);
        const idHex = data._id.toString();
        if(cid === idHex){
            res.status(200).send({ message: "Carrito encontrado.", data:  data });
            console.log(carrito);
        } else {
            res.status(400).send({ status: "error", message: "Carrito no encontrado" });
        }
       
    } catch(err) {
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
            res.status(400).send({ status: "error", message: "Carrito no encontrado" });
        }
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
};

// export const addEmailToCart = async (req, res) => {
//     try {
//         const cartId= req.params.pid; // Suponiendo que recibes cartId y userEmail en el cuerpo de la solicitud
//         const loggedInUser = req.session.user; 
//         const userEmail = loggedInUser.email;
//         // Actualiza el campo 'email' del carrito con el ID proporcionado
//         await cartModel.findByIdAndUpdate(
//             { '_id': new mongoose.Types.ObjectId(cartId) },
//             { $set: { email: userEmail } }
//         );

//         res.status(200).send({ status: 'ok', message: 'Email agregado al carrito' });
//     } catch (err) {
//         res.status(500).send({ status: 'error', message: err.message });
//     }
// };

export const addEmailToCart = async (req, res) => {
    try {
        const cartId= req.params.pid
        const loggedInUser = req.session.user; 
        const userEmail = loggedInUser.email;
      await cart.addEmailToCart(cartId, userEmail);
      console.log(userEmail);
      console.log(cartId);
  
      if (!cartId) {
        return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
      }
  
      return res.status(200).json({ status: "ok", message: "Correo electrónico agregado al carrito" });
    } catch (err) {
      return res.status(500).json({ status: "error", message: err.message });
    }
  };

// export const purchaseCart = async (req, res) => {
//     const cartId = req.params.cid;
//     console.log(cartId);
//    try{

//    }

//         res.status(200).json({ message: 'Compra exitosa' });
//     } catch (err) {
//         res.status(500).json({ message: err.message});
//     }
// };

export const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;
    console.log(cartId, "cartId");
    
    try {
        const cartData = await cart.getCartById(cartId);
        const userEmail = cartData.email;

        const successfulPurchase = await cart.purchaseCartWithTicket(cartId, userEmail);

        if (successfulPurchase) {
            res.status(200).json({ message: 'Compra exitosa' });
        } else {
            res.status(400).json({ message: 'No se pudo completar la compra' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

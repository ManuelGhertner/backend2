import Carts from "../dao/services/carts.dbclass.js";

const cart = new Carts();

// Crear carrito.
export const createCart = async(req, res) => {
    try {
        const data = await cart.addCart(req.body);
        res.status(200).send({ status:  "ok",  message: `Carrito creado`, data  });
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
};

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
export const addProductToCart = async(req, res) => {
    try {
        const { cid, pid } = req.params;
  
        cart.addProductToCart(cid, pid);//agrego el producto al carrito.;
        res.status(200).send({ status: "ok", message: "Producto agregado al carrito" });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
};

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


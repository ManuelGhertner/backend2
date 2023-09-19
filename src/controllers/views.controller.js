import ProductsDB from "../dao/services/products.dbclass.js";
import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import { generateToken } from "../utils.js";
import { store } from "../utils.js";
import Carts from "../dao/services/carts.dbclass.js";


const products = new ProductsDB();
const carts = new Carts();

// REALTIME PRODUCTS
export const realTimeProducts = async (req, res) => {
    const currentProducts = await productModel.find().lean()
    res.render('realTimeProducts', { products: currentProducts });
};

// AGREGAR PRODUCTOS

export const addProducts = async (req, res) =>{
    res.render("productsCreator");
}

// PRODUCTOS DE USUARIO

// export const getProducts = async (req, res) =>{
//     const currentProducts = await productModel.find().lean()
//     res.render("productsOwned", { products: currentProducts });
// }

export const getProducts = async (req, res) => {
    try {
      const loggedInUser = req.session.user; // Obtén el usuario de la sesión
      if (!loggedInUser) {
        // Si no hay usuario logueado, muestra un mensaje de error o redirige a la página de inicio de sesión
        return res.status(401).send("Debes iniciar sesión para acceder a tus productos.");
      }
  
      // Consulta los productos que pertenecen al usuario logueado por su ID de propietario
      const currentProducts = await productModel.find({ owner: loggedInUser.id }).lean();
  
      res.render("productsOwned", { products: currentProducts });
    } catch (error) {
      res.status(500).send("Error al obtener tus productos.");
    }
  };

  //OBTENER TODOS LOS PRODUCTOS

  export const getAllProducts = async (req, res) => {
    try {
      // Consulta todos los productos en la base de datos
      const allProducts = await productModel.find().lean();
  
      res.render("productsOwned", { products: allProducts }); // Cambia "allProducts" al nombre de tu vista Handlebars
    } catch (error) {
      res.status(500).send("Error al obtener todos los productos.");
    }
  };

// REGISTRO
export const register = async (req, res) => {
    if(req.session.userValidated === true ) {
        res.redirect("/")
    } else {
        res.render("register", { errorMessages: req.session.errorMessages })
    }
};

export const profile = async (req, res) => {
    //datos de usuario.
    const user = req.session.user;
    res.render("profile", {user: user})
};
// LOGIN

export const login = async(req, res) =>{
    req.sessionStore.userValidated = req.session.userValidated = true;
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        role: req.user.role,
        id: req.user._id,
        // cart: req.user.cart
    };
    const accessToken = generateToken(req.session.user);
    console.log(accessToken)
    res.cookie("accessToken", accessToken, { httpOnly: true });
    
    res.redirect("/");
};

export const cart = async (req, res) => {
    try {
        let pid = req.params.pid;
        let cart = await carts.getCartByUserId(pid);
        let productsInCart = cart.products;
        console.log(cart);

        res.render("carts", {productsInCart})
    } catch(err) {
        res.status(400).json(err.message)
    }
};

export const renderUserCart = async (req, res) => {
    try {
        let pid = req.params.pid;
        const loggedInUser = req.session.user; // Obtén el usuario logueado
console.log(loggedInUser.id);
const user = await usuario.getUsersById(loggedInUser.id)
console.log(user.cart[0].carts);
const idHex = user.cart[0].carts._id.toString();
console.log(idHex, "render");


        // Obtener el carrito del usuario por su ID de carrito
        const userCart = await carts.getCartById(idHex);
            console.log(pid, "el pid");
        if (userCart) {
            // Renderizar la vista "carts" pasando el carrito y el usuario logueado
            res.render("carts", {pid});
        } else {
            // El carrito no fue encontrado
            res.status(404).json({ message: "Carrito no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// VERIFICAR SESION

export const verifySession = async (req, res) => {
    store.get(req.sessionID, async (err, data) => {
        //si hay un error
        if (err) console.log(`Error al obtener el usuario: ${err}`)

        //si la validacion de usuario es true se renderiza la vista de productos.
        if (data !== null && (req.session.userValidated)) {      
              
            let limit = parseInt(req.query.limit) || 10;
            let category = req.query.category || "";
            let sort = req.query.sort?.toString() || "";
            let page = parseInt(req.query.page) || 1;
            let status = req.query.status || "";

            const data = await products.getProducts(limit, page, sort, category, status);
            
            //datos de usuario.
            const user = req.session.user;

            res.status(200).render("home", { products: data, user: user })


        } else {
            //si la validacion de usuario es false se renderiza la vista de login.
            res.render("login", { sessionInfo: data, errorMessages: req.session.errorMessages  })
        }
    })
};

// LOGOUT

export const logout = async (req, res) => {
    req.session.userValidated = false;

    req.session.destroy((err) => {
        req.sessionStore.destroy(req.sessionID, (err) => {
            if (err) console.log(`Error al cerrar sesion: ${err}`);

            console.log("Sesion cerrada");
            res.redirect("/");
        });
    })
};
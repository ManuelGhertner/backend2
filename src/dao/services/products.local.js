// class ProductsDB {
//     static productID = 0;

//     constructor(path){
//         this.products = [
//         {id: 1, title: 'Producto 1', description: 'La descripción del producto 1', price: 1000 },

//         { id: 2, title: 'Producto 2', description: 'La descripción del producto 2', price: 2000 },
    
//         { id: 3, title: 'Producto 3', description: 'La descripción del producto 3', price: 3000 },
    
//         { id: 4, title: 'Producto 4', description: 'La descripción del producto 4', price: 4000 },
    
//         { id: 5, title: 'Producto 5', description: 'La descripción del producto 5', price: 5000 },
    
//         { id: 6, title: 'Producto 6', description: 'La descripción del producto 6', price: 6000 },
    
//         { id: 7, title: 'Producto 7', description: 'La descripción del producto 7', price: 7000 },
    
//         { id: 8, title: 'Producto 8', description: 'La descripción del producto 8', price: 8000 },
    
//         { id: 9, title: 'Producto 9', description: 'La descripción del producto 9', price: 9000 },
    
//         { id: 10, title: 'Producto 10', description: 'La descripción del producto 10', price: 10000 }];
//         this.status = 0;
//         this.statusMsg = "Iniciado";
//     }

//     static requiredFields = ['description', 'price', 'stock'];

//     static #verifyRequiredFields = (obj) => {
//         return Product.requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null && obj[field] !== undefined);
//     }

//     static #objEmpty (obj) {
//         return Object.keys(obj).length === 0;
//     }

//     checkStatus = () =>{
//         return this.statusMsg;
//     };
//     showStatusMsg = () =>{
//         return this.statusMsg;
//     }
//     addProduct = async (product) => {
//         try {
//             if (!ProductsDB.#objEmpty(product) ) {
//                 const process = this.products.push(product);
//                 this.status = 1;
//                 this.statusMsg = "Producto registrado en bbdd";
//             } else {
//                 this.status = -1;
//                 this.statusMsg = `Faltan campos obligatorios (${ProductsDB.requiredFields.join(', ')})`;
//             }
//         } catch (err) {
//             this.status = -1;
//             this.statusMsg = `AddProduct: ${err}`;
//             console.log("exploto");
//         }
//     }

//     getProducts = async () => {
//         try {
//             this.status = 1;
//             this.statusMsg = 'Productos recuperados';
//             return this.products;
//         } catch (err) {
//             this.status = -1;
//             this.statusMsg = `getProducts: ${err}`;
//         }
//     }
// }

// export default ProductsDB;

import fs from "fs";
// import productModel from "./products.model";
class ProductsLocal {
//   static newCode = 0;
//   static newId = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  getProducts = async() => {    
    const productsFile = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(productsFile)
    return products;
}

//agregar los productos.
addProduct = async (product) => {
try {
    const productsFile = await this.getProducts() // leo mis productos
    let codProd = productsFile.find((prod) => prod.code === product.code);
    let prodId = 0;

    if (productsFile.length === 0) {
        prodId = 1; 
    } else {
        prodId = productsFile[productsFile.length - 1].id + 1;
    }

    if (
        !product.title || // Verifico que ningun campo este vacio
        !product.description ||
        !product.price ||
        !product.stock ||
        !product.code ||
        !product.category
    )
    return { status: "error", message: "Todos los campos son requeridos!" };

    if (product.thumbnail === undefined) {
        product.thumbnail = [];
    }
    if (product.status === undefined) {
        product.status = true;
    }

    if (codProd) return { status: "error", message: "Code repetido!" };

    const prodToAdd = ({ id: prodId, ...product }); 
    productsFile.push(prodToAdd);//pusheo mi producto
    await fs.promises.writeFile(this.path, JSON.stringify(productsFile, null, 2));
    console.log(product); //Guardo mi array products en mi archivo.
    return `Se agregó el producto "${product.title}"`;
    
} catch (error) {
    return error;
}
};

  deleteProduct = async (id) => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      console.log(products);
      const index = this.products.findIndex((product) => product.id === id);
      if (index === -1) {
        console.log(`el id ${id} no fue encontrado`);
        return;
      }
      products.splice(index, 1);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      console.log(`el producto con id ${id} fue eliminado`);
    } catch (err) {
      console.log(err);
    }
  };

//   getProducts = async () => {
//     const products = await fs.promises.readFile(this.path, "utf-8");
//     // const products = await productModel.find();
//     return JSON.parse(products);
//   };

  updateProducts = async (id, updates) => {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const update = {
        ...this.products[index],
        ...updates,
        id: id,
      };
      this.products[index] = update;
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return update;
    } else {
      console.log("ID para actualizar producto no encontrado");
      return null;
    }
  };

  getProductById = async (id) => {
    const product = this.products.find((product) => product.id === id);
    console.log(product);
    if (product) {

      return product;
    } else {
      return null;
      console.log("Not Found");
    }
  };
}

export default ProductsLocal;

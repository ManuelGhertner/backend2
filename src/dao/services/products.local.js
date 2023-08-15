import fs from "fs";
class ProductsLocal {

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
    const productsFile = await this.getProducts()
    let codProd = productsFile.find((prod) => prod.code === product.code);
    let prodId = 0;

    if (productsFile.length === 0) {
        prodId = 1; 
    } else {
        prodId = productsFile[productsFile.length - 1].id + 1;
    }

    if (
        !product.title ||
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
    productsFile.push(prodToAdd);
    await fs.promises.writeFile(this.path, JSON.stringify(productsFile, null, 2));
    console.log(product); 
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

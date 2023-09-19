import mongoose from "mongoose";
import ProductsDB from "../dao/services/products.dbclass.js";
import chai from "chai";


const expect = chai.expect;
const connection = mongoose.connect("mongodb://127.0.0.1:27017/ecommerce2");
const testProduct = { title: "Media", description: "Media larga", code: 19023, price: 123, status: true, stock: 23, category: "Ropa", thumbnail: []};

describe("Testing de products.dbclass", () =>{
    before (function () {
        this.product = new ProductsDB();

    })

    beforeEach(function () {
        mongoose.connection.collections.products_test.drop();
        this.timeout(5000);
    })

    // TEST 1

          it("deberia cargar un nuevo usuario", async function (){
            const result = await this.product.addProduct(testProduct);
            expect(result._id).to.be.a('object')
          })
 
     
})
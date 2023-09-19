import mongoose from "mongoose";
import ProductsDB from "../dao/services/products.dbclass.js";
import Assert from "assert";


const assert = Assert.strict;
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

  
        it('debería devolver un objeto con la estructura correcta', async function() {
            // Llama a tu función getProducts con los parámetros deseados
            const result = await this.product.getProducts(3, 1, 'asc', 'ropa', true); // Puedes ajustar los parámetros según sea necesario
        
            // Asegúrate de que el resultado sea un objeto
            assert.strictEqual(typeof result, 'object');
        
            // Verifica que el objeto tenga las propiedades esperadas
            assert.ok(result.hasOwnProperty('status'));
            assert.ok(result.hasOwnProperty('payload'));
            assert.ok(result.hasOwnProperty('totalDocs'));
            assert.ok(result.hasOwnProperty('limit'));
            assert.ok(result.hasOwnProperty('totalPages'));
            assert.ok(result.hasOwnProperty('page'));
            assert.ok(result.hasOwnProperty('pagingCounter'));
            assert.ok(result.hasOwnProperty('hasPrevPage'));
            assert.ok(result.hasOwnProperty('hasNextPage'));
            assert.ok(result.hasOwnProperty('prevLink'));
            assert.ok(result.hasOwnProperty('nextLink'));
          });

          it("deberia cargar un nuevo usuario", async function (){
            const result = await this.product.addProduct(testProduct);
            assert.ok(result._id)
          })
 
     
})
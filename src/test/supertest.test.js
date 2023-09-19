import chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";


const expect = chai.expect;
const requester = supertest("http://localhost:3000");

describe("Test general de integracion", () =>{
    before (async function () {
        try{
            await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce2");
            await mongoose.connection.dropCollection("products_test")


        } catch (err){
            console.log(err.message);
        }
    })
    describe("Test de productos", () =>{
        it("POST /api/products debe crear un producto correctamente", async function(){
            const newProduct = { title: "Media", description: "Media larga", code: 190263, price: 123, status: true, stock: 23, category: "Ropa", thumbnail: []};
            const { statusCode, ok, body} = await requester.post("/api/products").send(newProduct);
            console.log(body);
            expect(statusCode).to.be.eql(200);
            expect(ok).to.be.eql(true);
            expect(body.status).to.be.eql("Success")
        })
    })

    after (async function () {
        try {
            await mongoose.disconnect()
        } catch (err) {
            console.log(err.message);
        }
    })

})
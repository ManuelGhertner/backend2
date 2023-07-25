import {} from "dotenv/config";
import express from "express";
import http from "http";
// import passport, { initialize } from "passport";
import mongoose from "mongoose";
import session from "express-session";
import { Server } from "socket.io";
import productsRouter from "./routes/products.routes.js";
import MongoStore from "connect-mongo";
import productsDB from "./dao/services/products.dbclass.js";

const COOKIE_SECRET = process.env.COOKIE_SECRET
const PORT = process.env.PORT;
const MONGOOSE_URL = process.env.MONGOOSE_URL;

// EXPRESS Y SOCKET.IO

const server = express();

const httpServer = http.createServer(server);

const io = new Server(httpServer, {
    cors : {
        origin: "*",
        methods: ["PUT", "POST", "DELETE", "GET", "OPTIONS"],
        credentials: false
    }
});

server.use(express.json());
server.use(express.urlencoded({ extended: true}));
// GESTION DE SESIONES

const store = MongoStore.create({mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl:60});

// SESIONES

server.use (session({
    store: store,
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// PASSPORT

// initializePassport();
// server.use(passport.initialize());
// server.use(passport.session());

// ENDPOINTS

server.use("/api", productsRouter)

// PLANTILLAS

// STATIC

// EVENTOS SOCKET.IO



// CONEXION SERVIDOR

try {
    await mongoose.connect(MONGOOSE_URL);
    server.listen(PORT, () =>{
        console.log(`Servidor iniciado en puerto: ${PORT}`);
    });
} catch (err){
    console.log(err);
};
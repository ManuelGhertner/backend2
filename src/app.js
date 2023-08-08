import config from "./config.js";
import express from "express";
import http from "http";
import passport from "passport";
// import MongoSingleton from "./dao/services/mongo.class.js";
import session from "express-session";
import { Server } from "socket.io";
import initializePassport from "./passport/passport.strategies.js";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import routerViews from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import MongoStore from "connect-mongo";
import ProductsDB from "./dao/services/products.dbclass.js";
import { store } from "./utils.js";
import sessionRoutes from "./routes/sessions.routes.js";


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

// SESIONES

server.use (session({
    store: store,
    secret: config.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// PASSPORT

initializePassport();
server.use(passport.initialize());
server.use(passport.session());

// ENDPOINTS

server.use("/api", productsRouter);
server.use("/", routerViews(store));
server.use("/api/sessions", sessionRoutes());

// PLANTILLAS
server.engine("handlebars", engine ({defaultLayout: "main", extname: ".handlebars"}));
server.set('view engine', 'handlebars');
server.set('views', './views');
// STATIC
server.use('/public', express.static(`${__dirname}/public`));
// EVENTOS SOCKET.IO



// CONEXION SERVIDOR

try {
    // MongoSingleton.getInstance();
    server.listen(config.PORT, () =>{
        console.log(`Servidor iniciado en puerto: ${config.PORT}`);
    });
} catch (err){
    console.log(err);
};
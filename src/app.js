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
import cartsRouter from "./routes/carts.routes.js";
import usersRouter from "./routes/user.routes.js";
// import mockRouter from "./routes/mocking.routes.js";
import compression from "express-compression";
import CustomError from "./dao/services/customError.js";
import errorsDict from "./dictionary.js";
import { addLogger } from "./dao/services/logger.service.js";
import cluster from "cluster";
import { cpus } from "os";

// EXPRESS Y SOCKET.IO



if(cluster.isPrimary){
   for (let i = 0; i < cpus().length; i++) cluster.fork();
   cluster.on("exit", (worker, code, signal) =>{
    console.log(`Se cerro el worker ${worker.process.pid}`);
    cluster.fork();
   })
} else {
    
const server = express();

const httpServer = http.createServer(server);

const io = new Server(httpServer, {
    cors : {
        origin: "*",
        methods: ["PUT", "POST", "DELETE", "GET", "OPTIONS"],
        credentials: false
    }
});
    server.use(compression({
        brotli: {enabled: true, zlib :{}}
    })); // lo dejo general pero evaluar conveniencia.
    server.use(express.json());
    server.use(express.urlencoded({ extended: true}));
    server.use(addLogger);
    
    // server.get("/pepe", (req, res) =>{
    // req.logger.warn("alerta prueba")
    // })
    
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
    server.use("/api", cartsRouter);
    server.use("/api", usersRouter)
    server.use("/api/sessions", sessionRoutes());
    // server.use("/api",mockRouter )
    
    // PLANTILLAS
    server.engine("handlebars", engine ({defaultLayout: "main", extname: ".handlebars"}));
    server.set('view engine', 'handlebars');
    server.set('views', './views');
    // STATIC
    server.use('/public', express.static(`${__dirname}/public`));
    
    
    
    server.all('*', (req, res, next) => {
        throw new CustomError(errorsDict.ROUTING_ERROR);
    });
    
    server.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).send({ status: 'ERR', payload: { msg: err.message } });
    });
    
    
    
    
    // EVENTOS SOCKET.IO
    
    
    
    // CONEXION SERVIDOR
    
    try {
        // MongoSingleton.getInstance();
        server.listen(config.PORT, () =>{
            console.log(`Servidor iniciado en puerto: ${config.PORT} (PID ${process.pid})`);
        });
    } catch (err){
        console.log(err);
    };
}




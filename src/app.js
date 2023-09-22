import config from "./config.js";
import express from "express";
import http from "http";
import passport from "passport";
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
import compression from "express-compression";
import CustomError from "./dao/services/customError.js";
import errorsDict from "./dictionary.js";
import { addLogger } from "./dao/services/logger.service.js";
import cluster from "cluster";
import { cpus } from "os";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import mailRouter from "./routes/mail.routes.js";
import handlebars from "handlebars";



// if(cluster.isPrimary){
//    for (let i = 0; i < cpus().length; i++) cluster.fork();
//    cluster.on("exit", (worker, code, signal) =>{
//     console.log(`Se cerro el worker ${worker.process.pid}`);
//     cluster.fork();
//    })
// } else { // COMENTADO PARA QUE FUNCIONE RAILWAY POR TEMAS DE MEMORIA
    
const server = express();

const httpServer = http.createServer(server);

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación APIS',
            description: 'Esta documentación cubre las APIS de Products y Carts'
        }
    },
    apis: ['./docs/**/*.yaml'] 
}

handlebars.registerHelper('eq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
  });
const specs = swaggerJsdoc(swaggerOptions);

const io = new Server(httpServer, {
    cors : {
        origin: "*",
        methods: ["PUT", "POST", "DELETE", "GET", "OPTIONS"],
        credentials: false
    }
});
    server.use(compression({
        brotli: {enabled: true, zlib :{}}
    })); 
    server.use(express.json());

    server.use(express.urlencoded({ extended: true}));

    server.use(addLogger);
       
    server.use (session({
        store: store,
        secret: config.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
    }));
    
    initializePassport();

    server.use(passport.initialize());

    server.use(passport.session());
    
    server.use("/api", productsRouter);

    server.use("/", routerViews(store));

    server.use("/api", cartsRouter);

    server.use("/api", usersRouter)

    server.use("/api/sessions", sessionRoutes());

    server.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

    server.use("/api", mailRouter);

    server.engine("handlebars", engine ({defaultLayout: "main", extname: ".handlebars"}));

    server.set('view engine', 'handlebars');

    server.set('views', `${__dirname}/views`);

    server.use('/public', express.static(`${__dirname}/public`));
    
    server.all('*', (req, res, next) => {
        throw new CustomError(errorsDict.ROUTING_ERROR);
    });
    
    server.use((err, req, res, next) => {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).send({ status: 'ERR', payload: { msg: err.message } });
    });
    
    try {
        server.listen(config.PORT, () =>{
            console.log(`Servidor iniciado en puerto: ${config.PORT} (PID ${process.pid})`);
        });
    } catch (err){
        console.log(err);
    };





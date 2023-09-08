import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config()
console.log(process.env.MODE)

// Si lo deseamos, podemos habilitar nuestra propia escala de niveles de error,
// con nombres y colores personalizados.
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        debug: "white"
    }
}

// createLogger() nos permite crear distintos "transportes".
// Un transporte es una vía de registro (por ejemplo hacia consola, archivo, etc)
const logger = winston.createLogger({
    transports: [
        // Al iniciar un transporte, indicamos desde qué nivel de error hacia arriba
        // (en importancia) deseamos loguear.
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({level: 'warn', filename: './logs/errors.log'}),
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            // Este ejemplo nos permite ver una opción de aplicación de errores personalizados
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:"./logs/prod_errors.log",
            level: "warning",
            format: winston.format.simple()
        })
    ]
})

const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({level: 'warn', filename: './logs/prod_errors.log'}),
    ]
})


export const addLogger = (req, res, next) => {

    req.logger = process.env.MODE === 'DEVEL' ? devLogger : prodLogger
    // req.logger.fatal(`${req.method} ${req.url} ${new Date().toLocaleTimeString()}`)
    next();
}
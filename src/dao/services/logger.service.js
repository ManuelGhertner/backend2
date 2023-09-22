import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config()

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

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'http'}),
        new winston.transports.File({level: 'warn', filename: './logs/errors.log'}),
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
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
    next();
}
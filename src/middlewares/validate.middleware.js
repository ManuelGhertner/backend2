//VALIDAR SI USUARIO ESTA LOGUEADO
const validate = async (req, res, next) => {
    if (req.session.userValidated) {
        next()
    } else {
        res.status(401).json("No autorizado");
    }
}

//VALIDACION DE ADMIN
const validateAdmin = async (req, res, next) => {
    if (req.user.role==="admin") {
        next()
    } else {
        res.status(401).json("No autorizado");
    }
}

// VALIDATE PREMIUM O ADMIN

const validatepPremiumOrAdmin = async (req, res, next) => {
    if (req.user.role==="admin" || req.user.role==="premium") {
        next()
    } else {
        res.status(401).json("No autorizado");
    }
}


export { validate, validateAdmin, validatepPremiumOrAdmin };
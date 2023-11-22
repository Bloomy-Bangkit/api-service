const ResponseError = require('../error/response-error.js')

const errorMiddleware = async(error, req, res, next) => {
    if (!error) {
        next()
        return
    }
    if (error instanceof ResponseError) {
        res.status(error.status).json({ errors: error.message }).end()
    } else {
        res.status(500).json({ errors: error.message }).end()
    }
}

module.exports = errorMiddleware
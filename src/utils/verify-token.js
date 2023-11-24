const jwt = require('jsonwebtoken')
const ResponseError = require('../error/response-error.js')

const verifyToken = async token => {
    try {
        if (!token) throw new ResponseError(400, 'Token tidak ada')
        return jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
        throw new ResponseError(403, error.message)
    }
}

module.exports = verifyToken
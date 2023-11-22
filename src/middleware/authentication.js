const jwt = require('jsonwebtoken')
const ResponseError = require('../error/response-error.js')

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) throw new ResponseError(401, 'Token invalid')
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) throw new ResponseError(401, 'Token expired')
        console.log({ decoded })
        req.email = decoded.email
        next()
    })
}

module.exports = authenticateToken
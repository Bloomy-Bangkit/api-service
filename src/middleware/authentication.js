const jwt = require('jsonwebtoken')
const ResponseError = require('../error/response-error.js')
const User = require('../user/user-model.js')

const authenticateToken = async(req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null || !token) return res.status(400).json({ message: 'Token invalid' })
    const searchUser = await User.findOne({ where: { token } })
    if (!searchUser) return res.status(400).json({ message: 'Token invalid' })
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) throw new ResponseError(401, 'Token expired')
        req.username = decoded.username
        next()
    })
}

module.exports = authenticateToken
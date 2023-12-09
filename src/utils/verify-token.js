const jwt = require('jsonwebtoken')
const ResponseError = require('../error/response-error.js')
const User = require('../user/user-model.js')

const verifyToken = async token => {
    try {
        if (!token) throw new ResponseError(400, 'Token invalid')
        const searchUser = await User.findOne({ where: { token } })
        if (!searchUser) throw new ResponseError(400, 'Token invalid')
        const username = jwt.verify(token, process.env.SECRET_KEY)
        if (!username) throw new ResponseError(400, 'Token expired')
        return true
    } catch (error) {
        throw new ResponseError(403, error.message)
    }
}

module.exports = verifyToken
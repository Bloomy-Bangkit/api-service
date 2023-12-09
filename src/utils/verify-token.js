const jwt = require('jsonwebtoken')
const ResponseError = require('../error/response-error.js')
const User = require('../user/user-model.js')

const verifyToken = async token => {
    try {
        if (!token) throw new ResponseError(401, 'Token invalid')
        const verifyPromise = new Promise(async(resolve, reject) => {
            jwt.verify(token, process.env.SECRET_KEY, async(error, decoded) => {
                if (error) {
                    reject()
                    throw new ResponseError(401, 'Token expired')
                }
                console.log({ decoded })
                resolve(decoded.email)
            })
        })
        return verifyPromise
    } catch (error) {
        throw new ResponseError(403, error.message)
    }
}

module.exports = verifyToken
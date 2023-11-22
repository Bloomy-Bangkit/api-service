const userService = require('./user-service.js')

const get = async(req, res, next) => {
    try {
        const email = req.email
        const result = await userService.getUser(email)
        res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    get
}
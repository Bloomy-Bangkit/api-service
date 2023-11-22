const userService = require('./user-service.js')

const getUser = async(req, res, next) => {
    try {
        const email = req.email
        const result = await userService.getUser(email)
        res.status(200).json({ message: 'Get user berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updateUser = async(req, res, next) => {
    try {
        const email = req.email
        const result = await userService.updateUser(email, req.body)
        res.status(200).json({ message: 'Update user berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updatePassword = async(req, res, next) => {
    try {
        const email = req.email
        const result = await userService.updatePassword(email, req.body)
        res.status(200).json({ message: 'Change password berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updatePhoto = async(req, res, next) => {}

module.exports = {
    getUser,
    updateUser,
    updatePassword,
    updatePhoto
}
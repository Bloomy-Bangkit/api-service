const userService = require('./user-service.js')
const ResponseError = require('../error/response-error.js')

const getUsers = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.getUsers(myUsername)
        res.status(200).json({ message: 'Get users berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getUser = async(req, res, next) => {
    try {
        const myUsername = req.username
        const username = req.query.username
        if (!username) throw new ResponseError(400, 'Query username dibutuhkan')
        const result = await userService.getUser(myUsername, username)
        res.status(200).json({ message: 'Get user by username berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getMyUser = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.getMyUser(myUsername)
        res.status(200).json({ message: 'Get my user berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updateUser = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.updateUser(myUsername, req.body)
        res.status(200).json({ message: 'Update user berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updatePassword = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.updatePassword(myUsername, req.body)
        res.status(200).json({ message: 'Change password berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updatePhoto = async(req, res, next) => {
    try {
        const myUsername = req.username
        res.status(200).json({ message: 'Change password berhasil', data: myUsername })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUsers,
    getUser,
    getMyUser,
    updateUser,
    updatePassword,
    updatePhoto
}
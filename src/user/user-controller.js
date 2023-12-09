const path = require('path')
const userService = require('./user-service.js')
const ResponseError = require('../error/response-error.js')

const getUsers = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.getUsers(myUsername)
        res.status(200).json({ error: false, message: 'Berhasil GET Data users', data: result })
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
        res.status(200).json({ error: false, message: 'Berhasil GET Data user', data: result })
    } catch (error) {
        next(error)
    }
}

const getMyUser = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.getMyUser(myUsername)
        res.status(200).json({ error: false, message: 'Berhasil GET Data saya', data: result })
    } catch (error) {
        next(error)
    }
}

const updateUser = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.updateUser(myUsername, req.body)
        res.status(200).json({ error: false, message: 'Berhasil update user', data: result })
    } catch (error) {
        next(error)
    }
}

const updatePassword = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.updatePassword(myUsername, req.body)
        res.status(200).json({ error: false, message: 'Berhasil change password', data: result })
    } catch (error) {
        next(error)
    }
}

const updatePhoto = async(req, res, next) => {
    try {
        const myUsername = req.username
        const file = req.file
        if (!file) throw new ResponseError(400, 'Tidak ada foto yang diunggah')
        const filename = file.filename
        const filePath = path.join(__dirname, '../../uploads', filename)
        const result = await userService.updatePhoto(myUsername, filePath)
        res.status(200).json({ error: false, message: 'Berhasil change photo', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteUsers = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.deleteUsers(myUsername)
        res.status(200).json({ error: false, message: 'Delete users berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await userService.deleteUser(myUsername)
        res.status(200).json({ error: false, message: 'Delete user berhasil', data: result })
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
    updatePhoto,
    deleteUsers,
    deleteUser
}
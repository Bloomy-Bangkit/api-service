const path = require('path')
const authService = require('./auth-service.js')

const register = async(req, res, next) => {
    try {
        const result = await authService.register(req, req.body)
        res.status(201).json({ error: false, message: 'Register berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const login = async(req, res, next) => {
    try {
        const result = await authService.login(req.body)
        res.status(200).json({ error: false, message: 'Login berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const verify = async(req, res, next) => {
    try {
        const token = req.query.token
        const isVerify = await authService.verify(token)
        if (!isVerify) throw new ResponseError(400, 'Akun belum diverifikasi')
        const filePath = '../views/index.html'
        const absolutePath = path.resolve(__dirname, filePath)
        res.sendFile(absolutePath)
    } catch (error) {
        next(error)
    }
}

const check = async(req, res, next) => {
    try {
        const result = await authService.check(req.query.token)
        res.status(200).json({ error: false, message: 'Token valid', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    verify,
    check
}
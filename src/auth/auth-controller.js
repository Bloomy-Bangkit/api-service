const util = require('util')
const path = require('path')
const jwt = require('jsonwebtoken')
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

const verifySend = async(req, res, next) => {
    try {
        const email = req.body.email
        const result = await authService.verifySend(req, email)
        res.status(200).json({ error: false, message: 'Berhasil mengirimkan link verifikasi akun', data: result })
    } catch (error) {
        next(error)
    }
}

const verify = async(req, res, next) => {
    try {
        const token = req.query.token
        const isVerify = await authService.verify(token)
        if (!isVerify) throw new ResponseError(400, 'Akun belum diverifikasi')
        const filePath = '../views/verify.ejs'
        const absolutePath = path.resolve(__dirname, filePath)
        return res.render(absolutePath)
    } catch (error) {
        next(error)
    }
}

const check = async(req, res, next) => {
    try {
        const result = await authService.check(req.username)
        res.status(200).json({ error: false, message: 'Token valid', data: result })
    } catch (error) {
        next(error)
    }
}

const getForgotLink = async(req, res, next) => {
    try {
        const email = req.body.email
        const result = await authService.getForgotLink(req, email)
        res.status(200).json({ error: false, message: 'Berhasil mengirimkan link lupa password ke email', data: result })
    } catch (error) {
        next(error)
    }
}

const getForgotPage = async(req, res, next) => {
    try {
        const token = req.query.token
        const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
        const verifyAsync = util.promisify(jwt.verify)
        const result = await verifyAsync(token, SECRET_KEY)
        if (!result.forgot) return res.redirect('https://website-bloomy.vercel.app/')
        return res.render(path.resolve(__dirname, '../views/forgot.ejs'), { gagal: false, email: result.email })
    } catch (error) {
        return res.redirect('https://website-bloomy.vercel.app/')
    }
}


const postForgot = async(req, res, next) => {
    try {
        const result = await authService.postForgot(req.body)
        if (!result) return res.render(path.resolve(__dirname, '../views/forgot.ejs'), { gagal: true, message: 'Password dan Confirm Password tidak sesuai', email: req.body.email });
        return res.render(path.resolve(__dirname, '../views/forgot-success.ejs'))
    } catch (error) {
        return res.redirect('https://website-bloomy.vercel.app/')
    }
}

module.exports = {
    register,
    login,
    verifySend,
    verify,
    check,
    getForgotLink,
    getForgotPage,
    postForgot
}
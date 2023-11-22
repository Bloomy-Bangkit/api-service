const authService = require('./auth-service.js')

const register = async(req, res, next) => {
    try {
        const result = await authService.register(req, req.body)
        res.status(201).json({ data: result })
    } catch (error) {
        next(error)
    }
}

const login = async(req, res, next) => {
    try {
        const result = await authService.login(req.body)
        res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
}

const verify = async(req, res, next) => {
    try {
        const result = await authService.verify(req.query.token)
        res.status(200).json({ data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    register,
    login,
    verify
}
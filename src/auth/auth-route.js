const express = require('express')
const authController = require('./auth-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const authRoute = express.Router()

authRoute.post('/register', authController.register, errorMiddleware)
authRoute.post('/login', authController.login, errorMiddleware)
authRoute.get('/verify', authController.verify, errorMiddleware)
authRoute.get('/check', authController.check, errorMiddleware)

module.exports = authRoute
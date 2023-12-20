const express = require('express')
const authController = require('./auth-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const authRoute = express.Router()

authRoute.post('/register', authController.register, errorMiddleware)
authRoute.post('/login', authController.login, errorMiddleware)
authRoute.post('/verify/send', authController.verifySend, errorMiddleware)
authRoute.get('/verify', authController.verify, errorMiddleware)
authRoute.get('/check', authenticateToken, authController.check, errorMiddleware)
authRoute.get('/forgot', authController.getForgotPage, errorMiddleware)
authRoute.post('/forgot/link', authController.getForgotLink, errorMiddleware)
authRoute.post('/forgot', authController.postForgot, errorMiddleware)

module.exports = authRoute
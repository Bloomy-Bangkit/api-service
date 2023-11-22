const express = require('express')
const userController = require('./user-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const userRoute = express.Router()

userRoute.get('/', authenticateToken, userController.getUser, errorMiddleware)
userRoute.put('/', authenticateToken, userController.updateUser, errorMiddleware)
userRoute.put('/password', authenticateToken, userController.updatePassword, errorMiddleware)
userRoute.put('/photo', authenticateToken, userController.updatePhoto, errorMiddleware)

module.exports = userRoute
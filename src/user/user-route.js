const express = require('express')
const userController = require('./user-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const userRoute = express.Router()

userRoute.get('/', authenticateToken, userController.get, errorMiddleware)

module.exports = userRoute
const express = require('express')
const userController = require('./user-controller.js')
const upload = require('../utils/multer.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const userRoute = express.Router()

userRoute.get('/users', authenticateToken, userController.getUsers, errorMiddleware)
userRoute.get('/user', authenticateToken, userController.getUser, errorMiddleware)
userRoute.get('/user/me', authenticateToken, userController.getMyUser, errorMiddleware)
userRoute.put('/user', authenticateToken, userController.updateUser, errorMiddleware)
userRoute.put('/user/password', authenticateToken, userController.updatePassword, errorMiddleware)
userRoute.put('/user/photo', authenticateToken, upload.single('image'), userController.updatePhoto, errorMiddleware)
userRoute.delete('/users', authenticateToken, userController.deleteUsers, errorMiddleware)
userRoute.delete('/user/:id', authenticateToken, userController.deleteUser, errorMiddleware)
module.exports = userRoute
const express = require('express')
const cartController = require('./cart-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const cartRoute = express.Router()

cartRoute.get('/carts', authenticateToken, cartController.getCarts, errorMiddleware)
cartRoute.post('/cart', authenticateToken, cartController.postCart, errorMiddleware)
cartRoute.delete('/cart', authenticateToken, cartController.deleteCart, errorMiddleware)

module.exports = cartRoute
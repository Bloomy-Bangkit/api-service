const express = require('express')
const productController = require('./product-controller.js')
const upload = require('../utils/multer.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const productRoute = express.Router()

productRoute.get('/products', authenticateToken, productController.getProducts, errorMiddleware)
productRoute.get('/product', authenticateToken, productController.getProduct, errorMiddleware)
productRoute.get('/product/me', authenticateToken, productController.getMyProduct, errorMiddleware)
productRoute.post('/product', authenticateToken, upload.single('image'), productController.postProduct, errorMiddleware)
productRoute.put('/product', authenticateToken, productController.updateProduct, errorMiddleware) // EDIT
productRoute.put('/product/photo', authenticateToken, productController.updatePhotoProduct, errorMiddleware) // EDIT
productRoute.delete('/products', authenticateToken, productController.deleteProducts, errorMiddleware)
productRoute.delete('/product/:id', authenticateToken, productController.deleteProduct, errorMiddleware)

module.exports = productRoute
const express = require('express')
const favoriteController = require('./favorite-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const favoriteRoute = express.Router()

favoriteRoute.get('/favorites', authenticateToken, favoriteController.getFavorites, errorMiddleware)
favoriteRoute.get('/favorite', authenticateToken, favoriteController.getFavorite, errorMiddleware)
favoriteRoute.get('/favorite/me', authenticateToken, favoriteController.getMyFavorite, errorMiddleware)
favoriteRoute.post('/favorite', authenticateToken, favoriteController.postFavorite, errorMiddleware)
favoriteRoute.delete('/favorites', authenticateToken, favoriteController.deleteFavorites, errorMiddleware)
favoriteRoute.delete('/favorite/:id', authenticateToken, favoriteController.deleteFavorite, errorMiddleware)

module.exports = favoriteRoute
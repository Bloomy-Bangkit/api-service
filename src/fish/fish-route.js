const express = require('express')
const fishController = require('./fish-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const fishRoute = express.Router()

fishRoute.get('/fishs', authenticateToken, fishController.getFishs, errorMiddleware)
fishRoute.get('/fish/:id', authenticateToken, fishController.getFishId, errorMiddleware)
fishRoute.post('/fish', authenticateToken, fishController.postFish, errorMiddleware)
fishRoute.put('/fish/:id', authenticateToken, fishController.putFish, errorMiddleware)
fishRoute.delete('/fish/:id', authenticateToken, fishController.deleteFish, errorMiddleware)

module.exports = fishRoute
const express = require('express')
const weatherController = require('./other-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const weatherRoute = express.Router()

weatherRoute.get('/cuaca', weatherController.getCuaca, errorMiddleware)
weatherRoute.get('/gempa', weatherController.getGempa, errorMiddleware)

module.exports = weatherRoute
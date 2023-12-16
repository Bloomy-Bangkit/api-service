const express = require('express')
const locationController = require('./location-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const locationRoute = express.Router()

locationRoute.get('/provinsi', locationController.getProvinsi, errorMiddleware)
locationRoute.get('/provinsi/:nama/kota', locationController.getKota, errorMiddleware)

module.exports = locationRoute
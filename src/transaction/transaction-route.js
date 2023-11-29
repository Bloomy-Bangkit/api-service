const express = require('express')
const transactionController = require('./transaction-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const transactionRoute = express.Router()

transactionRoute.get('/transactions', authenticateToken, transactionController.getTransactions, errorMiddleware)
transactionRoute.post('/transaction', authenticateToken, transactionController.postTransaction, errorMiddleware)
transactionRoute.put('/transaction', authenticateToken, transactionController.putTransaction, errorMiddleware)
transactionRoute.delete('/transaction', authenticateToken, transactionController.deleteTransaction, errorMiddleware)

module.exports = transactionRoute
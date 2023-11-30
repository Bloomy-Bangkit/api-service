const express = require('express')
const transactionController = require('./transaction-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const transactionRoute = express.Router()

transactionRoute.get('/transactions', authenticateToken, transactionController.getTransactions, errorMiddleware)
transactionRoute.get('/transaction', authenticateToken, transactionController.getTransaction, errorMiddleware)
transactionRoute.get('/transaction/me', authenticateToken, transactionController.getMyTransaction, errorMiddleware)
transactionRoute.get('/transaction/buyer', authenticateToken, transactionController.getTransactionAsBuyer, errorMiddleware)
transactionRoute.get('/transaction/seller', authenticateToken, transactionController.getTransactionAsSeller, errorMiddleware)
transactionRoute.post('/transaction', authenticateToken, transactionController.postTransaction, errorMiddleware)
transactionRoute.put('/transaction/buyer/:id', authenticateToken, transactionController.putTransactionAsBuyer, errorMiddleware)
transactionRoute.put('/transaction/seller/:id', authenticateToken, transactionController.putTransactionAsSeller, errorMiddleware)
transactionRoute.delete('/transactions', authenticateToken, transactionController.deleteTransactions, errorMiddleware)
transactionRoute.delete('/transaction', authenticateToken, transactionController.deleteTransaction, errorMiddleware)

module.exports = transactionRoute
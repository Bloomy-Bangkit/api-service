const express = require('express')
const transactionController = require('./transaction-controller.js')
const authenticateToken = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const transactionRoute = express.Router()

transactionRoute.get('/transactions', authenticateToken, transactionController.getTransactions, errorMiddleware)
transactionRoute.get('/transaction', authenticateToken, transactionController.getTransaction, errorMiddleware)
transactionRoute.get('/transactions/me', authenticateToken, transactionController.getMyTransactions, errorMiddleware)
transactionRoute.get('/transactions/me/buyer', authenticateToken, transactionController.getTransactionAsBuyer, errorMiddleware)
transactionRoute.get('/transactions/me/seller', authenticateToken, transactionController.getTransactionAsSeller, errorMiddleware)
transactionRoute.post('/transaction', authenticateToken, transactionController.postTransaction, errorMiddleware)
transactionRoute.put('/transaction/buyer/:id', authenticateToken, transactionController.putTransactionAsBuyer, errorMiddleware)
transactionRoute.put('/transaction/seller/:id', authenticateToken, transactionController.putTransactionAsSeller, errorMiddleware)
transactionRoute.put('/transaction/reject/:id', authenticateToken, transactionController.rejectTransaction, errorMiddleware)
transactionRoute.delete('/transactions', authenticateToken, transactionController.deleteTransactions, errorMiddleware)
transactionRoute.delete('/transaction/:id', authenticateToken, transactionController.deleteTransaction, errorMiddleware)

module.exports = transactionRoute
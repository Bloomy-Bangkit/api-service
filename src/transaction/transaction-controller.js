const transactionService = require('./transaction-service.js')

const getTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getTransactions(myUsername)
        res.status(200).json({ error: false, message: 'Get transactions berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getTransaction = async(req, res, next) => {
    try {
        const myUsername = req.username
        const { username, id } = req.query
        if (username) {
            const result = await transactionService.getTransactionByUsername(myUsername, username)
            res.status(200).json({ error: false, message: 'Get transaction by username berhasil', data: result })
        } else if (id) {
            const result = await transactionService.getTransactionById(myUsername, id)
            res.status(200).json({ error: false, message: 'Get transaction by id berhasil', data: result })
        } else {
            throw new ResponseError(400, 'Query dibutuhkan')
        }
    } catch (error) {
        next(error)
    }
}

const getMyTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getMyTransactions(myUsername)
        res.status(200).json({ error: false, message: 'Get my transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getTransactionAsBuyer = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getTransactionAsBuyer(myUsername)
        res.status(200).json({ error: false, message: 'Get transaction sebegai Buyer berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getTransactionAsSeller = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getTransactionAsSeller(myUsername)
        res.status(200).json({ error: false, message: 'Get transaction sebegai Seller berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const postTransaction = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.postTransaction(myUsername, req.body)
        res.status(200).json({ error: false, message: 'Post transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const putTransactionAsBuyer = async(req, res, next) => {
    try {
        const myUsername = req.username
        const idTransaction = req.params.id
        const result = await transactionService.putTransactionAsBuyer(myUsername, idTransaction, req.body)
        res.status(200).json({ error: false, message: 'Put transaction sebagai Buyer  berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const putTransactionAsSeller = async(req, res, next) => {
    try {
        const myUsername = req.username
        const idTransaction = req.params.id
        const result = await transactionService.putTransactionAsSeller(myUsername, idTransaction, req.body)
        res.status(200).json({ error: false, message: 'Put transaction sebagai Seller berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const rejectTransaction = async(req, res, next) => {
    try {
        const myUsername = req.username
        const idTransaction = req.params.id
        const result = await transactionService.rejectTransaction(myUsername, idTransaction)
        res.status(200).json({ error: false, message: 'Reject transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.deleteTransactions(myUsername)
        res.status(200).json({ error: false, message: 'Delete transactions berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteTransaction = async(req, res, next) => {
    try {
        const myUsername = req.username
        const idTransaction = req.params.id
        const result = await transactionService.deleteTransaction(myUsername, idTransaction)
        res.status(200).json({ error: false, message: 'Delete transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getTransactions,
    getTransaction,
    getMyTransactions,
    getTransactionAsBuyer,
    getTransactionAsSeller,
    postTransaction,
    putTransactionAsBuyer,
    putTransactionAsSeller,
    rejectTransaction,
    deleteTransactions,
    deleteTransaction
}
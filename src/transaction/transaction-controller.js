const transactionService = require('./transaction-service.js')

const getTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getTransactions(myUsername)
        res.status(200).json({ message: 'Get transactions berhasil', data: result })
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
            res.status(200).json({ message: 'Get transaction by username berhasil', data: result })
        } else if (id) {
            const result = await transactionService.getTransactionById(myUsername, id)
            res.status(200).json({ message: 'Get transaction by id berhasil', data: result })
        } else {
            throw new ResponseError(400, 'Query dibutuhkan')
        }
    } catch (error) {
        next(error)
    }
}
const getMyTransaction = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getMyTransaction(myUsername)
        res.status(200).json({ message: 'Get my transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}
const getTransactionAsBuyer = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getTransactionAsBuyer(myUsername)
        res.status(200).json({ message: 'Get transaction sebegai Seller berhasil', data: result })
    } catch (error) {
        next(error)
    }
}
const getTransactionAsSeller = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getTransactionAsSeller(myUsername)
        res.status(200).json({ message: 'Get transaction sebegai Seller berhasil', data: result })
    } catch (error) {
        next(error)
    }
}
const postTransaction = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.postTransaction(myUsername, req.body)
        res.status(200).json({ message: 'Post transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}
const putTransactionAsBuyer = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.putTransactionAsBuyer(myUsername)
        res.status(200).json({ message: 'Put transaction sebagai Buyer  berhasil', data: result })
    } catch (error) {
        next(error)
    }
}
const putTransactionAsSeller = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.putTransactionAsSeller(myUsername)
        res.status(200).json({ message: 'Put transaction sebagai Seller berhasil', data: result })
    } catch (error) {
        next(error)
    }
}
const deleteTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.deleteTransactions(myUsername)
        res.status(200).json({ message: 'Delete transactions berhasil', data: result })
    } catch (error) {
        next(error)
    }
}
const deleteTransaction = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.deleteTransaction(myUsername)
        res.status(200).json({ message: 'Delete transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getTransactions,
    getTransaction,
    getMyTransaction,
    getTransactionAsBuyer,
    getTransactionAsSeller,
    postTransaction,
    putTransactionAsBuyer,
    putTransactionAsSeller,
    deleteTransactions,
    deleteTransaction
}
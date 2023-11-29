const transactionService = require('./transaction-service.js')

const getTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.getTransactions(myUsername)
        res.status(200).json({ message: 'Get transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const postTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.postTransactions(myUsername)
        res.status(200).json({ message: 'Post transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updateTransactions = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await transactionService.updateTransactions(myUsername)
        res.status(200).json({ message: 'Delete transaction berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getTransactions,
    postTransactions,
    updateTransactions
}
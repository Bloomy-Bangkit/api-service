const { v4: uuidv4 } = require('uuid')
const validate = require('../middleware/validation.js')
const transactionValidation = require('./transaction-validation.js')

const getTransactions = async myUsername => {}

const getTransaction = async myUsername => {}

const getMyTransaction = async myUsername => {}

const getTransactionAsBuyer = async myUsername => {}

const getTransactionAsSeller = async myUsername => {}

const postTransaction = async(myUsername, request) => {
    const validUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validRequest = validate(transactionValidation.postTransactionValidation, request)
}

const putTransactionAsBuyer = async myUsername => {}

const putTransactionAsSeller = async myUsername => {}

const deleteTransactions = async myUsername => {}

const deleteTransaction = async myUsername => {}


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
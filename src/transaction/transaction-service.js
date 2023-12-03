const { v4: uuidv4 } = require('uuid')
const { Op } = require("sequelize");
const sequelize = require('../application/sequelize.js')
const validate = require('../middleware/validation.js')
const Transaction = require('./transaction-model.js')
const Product = require('../product/product-model.js')
const User = require('../user/user-model.js')
const transactionValidation = require('./transaction-validation.js')
const checkUserAvailable = require('../utils/check-user-available.js')
const checkProductAvailable = require('../utils/check-product-available.js')
const ResponseError = require('../error/response-error.js')

const getTransactions = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    await checkUserAvailable(false, validMyUsername)
    const searchTransactions = await Transaction.findAll()
    if (searchTransactions.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    return searchTransactions
}

const getTransactionByUsername = async(myUsername, username) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validUsername = validate(transactionValidation.usernameValidation, username)
    await checkUserAvailable(false, validMyUsername)
    const searchTransactionsAsSeller = await Transaction.findAll({
        include: Product,
        where: { username: validUsername }
    })
    console.log({ searchTransactionsAsSeller })
}

const getTransactionById = async(myUsername, idTransaction) => {}

const getMyTransaction = async myUsername => {}

const getTransactionAsBuyer = async myUsername => {}

const getTransactionAsSeller = async myUsername => {}

const postTransaction = async(myUsername, request) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validRequest = validate(transactionValidation.postTransactionValidation, request)
    const searchUser = await checkUserAvailable(true, validMyUsername)
    const searchProduct = await checkProductAvailable(true, validRequest.idProduct)
    if (searchProduct.weight < request.weight) throw new ResponseError('Product tidak tersedia')
    const price = searchProduct.price * request.weight
    if (price !== request.price) throw new ResponseError('Price tidak sesuai')
    const transaction = await sequelize.transaction()
    try {
        const postTransaction = await Transaction.create({
            idTransaction: uuidv4(),
            idProduct: request.idProduct,
            usernameBuyer: searchUser.username,
            weight: validRequest.weight,
            price: request.price || price,
            type: validRequest.type,
            status: '0'
        }, { transaction })
        searchProduct.weight = searchProduct.weight - validRequest.weight
        const updatedProduct = await searchProduct.save({ transaction })
        await transaction.commit()
        return { postTransaction, updatedProduct }
    } catch (error) {
        await transaction.rollback();
    }
}

const putTransactionAsBuyer = async myUsername => {}

const putTransactionAsSeller = async myUsername => {}

const deleteTransactions = async myUsername => {}

const deleteTransaction = async myUsername => {}


module.exports = {
    getTransactions,
    getTransactionByUsername,
    getTransactionById,
    getMyTransaction,
    getTransactionAsBuyer,
    getTransactionAsSeller,
    postTransaction,
    putTransactionAsBuyer,
    putTransactionAsSeller,
    deleteTransactions,
    deleteTransaction
}
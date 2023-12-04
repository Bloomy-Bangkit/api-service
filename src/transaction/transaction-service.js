const { v4: uuidv4 } = require('uuid')
const sequelize = require('../application/sequelize.js')
const validate = require('../middleware/validation.js')
const Transaction = require('./transaction-model.js')
const Product = require('../product/product-model.js')
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
    const searchTransactionsAsSeller = await Transaction.findAll({ where: { usernameBuyer: validUsername } })
    if (searchTransactionsAsSeller.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    return searchTransactionsAsSeller
}

const getTransactionById = async(myUsername, idTransaction) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    await checkUserAvailable(false, validMyUsername)
    const searchTransaction = await Transaction.findOne({ where: { idTransaction: validIdTransaction } })
    if (!searchTransaction) throw new ResponseError(400, 'Transaction tidak tersedia')
    return searchTransaction
}

const getMyTransactions = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const searchUser = await checkUserAvailable(true, validMyUsername)
    const searchMyTransactions = await Transaction.findAll({ where: { usernameBuyer: searchUser.dataValues.username } })
    if (searchMyTransactions.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    return searchMyTransactions
}

const getTransactionAsBuyer = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const searchUser = await checkUserAvailable(true, validMyUsername)
    const searchMyTransactionsAsBuyer = await Transaction.findAll({ where: { usernameBuyer: searchUser.dataValues.username } })
    if (searchMyTransactionsAsBuyer.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    return searchMyTransactionsAsBuyer
}

const getTransactionAsSeller = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    await checkUserAvailable(false, validMyUsername)
    const searchMyTransactionsAsSeller = await Transaction.findAll({ include: Product })
    const transactions = searchMyTransactionsAsSeller.filter(transaction => transaction.dataValues.product.dataValues.usernameSeller === validMyUsername)
    if (transactions.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    return transactions
}

const postTransaction = async(myUsername, request) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validRequest = validate(transactionValidation.postTransactionValidation, request)
    const searchUser = await checkUserAvailable(true, validMyUsername)
    const searchProduct = await checkProductAvailable(true, validRequest.idProduct)
    if (searchProduct.weight < request.weight) throw new ResponseError(400, 'Jumlah product tidak tersedia')
    if (searchProduct.dataValues.username === validMyUsername) throw new ResponseError(400, 'Tidak bisa membeli product sendiri')
    const defaultStatus = '0'
    const transaction = await sequelize.transaction()
    try {
        const postTransaction = await Transaction.create({
            idTransaction: uuidv4(),
            idProduct: request.idProduct,
            usernameBuyer: searchUser.dataValues.username,
            weight: validRequest.weight,
            price: searchProduct.dataValues.price * validRequest.weight,
            type: validRequest.type,
            status: defaultStatus,
            datePickup: validRequest.type === '1' ? request.datePickup : ''
        }, { transaction })
        searchProduct.weight = searchProduct.weight - validRequest.weight
        const updatedProduct = await searchProduct.save({ transaction })
        await transaction.commit()
        return { postTransaction, updatedProduct }
    } catch (error) {
        await transaction.rollback()
        throw new ResponseError(400, `Rollback, error: ${error.message}`)
    }
}

const putTransactionAsBuyer = async(myUsername, idTransaction, request) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    const validRequest = validate(transactionValidation.putRequestAsBuyerValidation, request)
    await checkUserAvailable(false, validMyUsername)
    const searchTranscation = await Transaction.findOne({ include: Product, where: { idTransaction: validIdTransaction, usernameBuyer: validMyUsername } })
    if (!searchTranscation) throw new ResponseError(400, 'Transaksi tidak tersedia')
    const checkWeightAvailable = searchTranscation.dataValues.product.dataValues.weight > validRequest.weight ? validRequest.weight : false
    if (!checkWeightAvailable) throw new ResponseError(400, 'Product tidak tersedia')
    const checkStatusAvailable = validRequest.type && searchTranscation.dataValues.status === '0' ? validRequest.type : false
    if (!checkStatusAvailable) throw new ResponseError(400, 'Tidak bisa mengubah status, transaksi sedang diproses')
    searchTranscation.weight = validRequest.weight ? validRequest.weight : searchTranscation.dataValues.weight
    searchTranscation.type = validRequest.type ? validRequest.type : searchTranscation.dataValues.type
    searchTranscation.datePickup = validRequest.datePickup && validRequest.type === '0' ? '' : validRequest.datePickup
    const updateTransaction = await searchTranscation.save()
    if (!updateTransaction) throw new ResponseError(400, 'Update transaksi sebagai Buyer gagal')
    return updateTransaction
}

const putTransactionAsSeller = async(myUsername, idTransaction, request) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    const validRequest = validate(transactionValidation.putRequestAsSellerValidation, request)
    await checkUserAvailable(false, validMyUsername)
    const searchTranscation = await Transaction.findOne({ include: Product, where: { idTransaction: validIdTransaction } })
    if (!searchTranscation) throw new ResponseError(400, 'Transaksi tidak tersedia')
    const checkTypeIsDiantar = searchTranscation.dataValues.type === 0 ? true : false
    searchTranscation.status = validRequest.status && validRequest.status === '1' ? validRequest.status : searchTranscation.dataValues.status
    searchTranscation.noResi = validRequest.noResi && checkTypeIsDiantar ? validRequest.noResi : ''
    searchTranscation.ongkir = validRequest.ongkir && checkTypeIsDiantar ? validRequest.ongkir : 0
    const updateTransaction = await searchTranscation.save()
    if (!updateTransaction) throw new ResponseError(400, 'Update transaksi sebagai Seller gagal')
    return updateTransaction
}

const rejectTransaction = async myUsername => {}

const deleteTransactions = async myUsername => {}

const deleteTransaction = async(myUsername, idTransaction) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    await checkUserAvailable(false, validMyUsername)
    const searchTransaction = await Transaction.findOne({ where: { idTransaction: validIdTransaction } })
    if (!searchTransaction) throw new ResponseError(404, 'Transaksi tidak tersedia')
    const deletedTransaction = await Transaction.destroy({
        where: {
            idTransaction: searchTransaction.dataValues.idTransaction,
            usernameBuyer: searchTransaction.dataValues.validMyUsername
        }
    })
    if (deletedTransaction.length === 0) throw new ResponseError(400, 'Transaction gagal dihapus')
    return { idTransaction: validIdTransaction, isDelete: deletedTransaction === 1 ? true : false }
}

module.exports = {
    getTransactions,
    getTransactionByUsername,
    getTransactionById,
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
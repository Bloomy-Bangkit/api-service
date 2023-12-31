const { v4: uuidv4 } = require('uuid')
const sequelize = require('../application/sequelize.js')
const validate = require('../middleware/validation.js')
const Transaction = require('./transaction-model.js')
const Product = require('../product/product-model.js')
const transactionValidation = require('./transaction-validation.js')
const checkUserAvailable = require('../utils/check-user-available.js')
const checkProductAvailable = require('../utils/check-product-available.js')
const ResponseError = require('../error/response-error.js')
const User = require('../user/user-model.js')

const getTransactions = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    await checkUserAvailable(false, validMyUsername)
    const searchTransactions = await Transaction.findAll()
    if (searchTransactions.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    const transactions = await Promise.all(searchTransactions.map(async transaction => {
        const transactionDataValues = {...transaction.dataValues }
        const plainTransaction = {...transactionDataValues }
        const usernameBuyer = plainTransaction.usernameBuyer
        const searchBuyer = await User.findOne({ where: { username: usernameBuyer } })
        if (!searchBuyer) throw new ResponseError(400, 'Buyer tidak ada')
        const searchProduct = await Product.findOne({ where: { idProduct: plainTransaction.idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Product tidak ada')
        const searchSeller = await User.findOne({ where: { username: searchProduct.dataValues.usernameSeller } })
        if (!searchSeller) throw new ResponseError(400, 'Seller tidak ada')
        return {
            idTransaction: plainTransaction.idTransaction,
            weight: plainTransaction.weight,
            price: plainTransaction.price,
            type: plainTransaction.type,
            status: plainTransaction.status,
            noResi: plainTransaction.noResi,
            ongkir: plainTransaction.ongkir,
            totalPrice: plainTransaction.price + plainTransaction.ongkir,
            datePickup: plainTransaction.datePickup,
            createdAt: plainTransaction.createdAt,
            updatedAt: plainTransaction.updatedAt,
            product: {
                idProduct: plainTransaction.idProduct,
                grade: searchProduct.dataValues.grade,
                nama: searchProduct.dataValues.nama,
                picture: searchProduct.dataValues.picture,
                pricePerKg: searchProduct.dataValues.price
            },
            buyer: {
                usernameBuyer: searchBuyer.dataValues.username,
                namaBuyer: searchBuyer.dataValues.nama,
                picture: searchBuyer.dataValues.photo
            },
            seller: {
                usernameSeller: searchSeller.dataValues.username,
                nama: searchSeller.dataValues.nama,
                picture: searchSeller.dataValues.photo,
            }
        }
    }))
    return transactions
}

const getTransactionByUsername = async(myUsername, username) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validUsername = validate(transactionValidation.usernameValidation, username)
    const searchUser = await checkUserAvailable(true, validUsername)
    const searchMyTransactionsAsBuyer = await Transaction.findAll({ where: { usernameBuyer: searchUser.dataValues.username } })
    const searchMyTransactionsAsSeller = await Transaction.findAll({ include: Product })
    const myTransactionAsSeller = searchMyTransactionsAsSeller.filter(transaction => transaction.dataValues.product.dataValues.usernameSeller === validMyUsername)
    const TransactionAsSeller = await Promise.all(myTransactionAsSeller.map(async transaction => {
        const transactionDataValues = {...transaction.dataValues }
        const plainTransaction = {...transactionDataValues }
        const usernameBuyer = transaction.usernameBuyer
        const searchBuyer = await User.findOne({ where: { username: usernameBuyer } })
        if (!searchBuyer) throw new ResponseError(400, 'Buyer tidak ada')
        const searchProduct = await Product.findOne({ where: { idProduct: transaction.idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Product tidak ada')
        return {
            idTransaction: plainTransaction.idTransaction,
            weight: plainTransaction.weight,
            price: plainTransaction.price,
            type: plainTransaction.type,
            status: plainTransaction.status,
            noResi: plainTransaction.noResi,
            ongkir: plainTransaction.ongkir,
            datePickup: plainTransaction.datePickup,
            totalPrice: plainTransaction.price + plainTransaction.ongkir,
            createdAt: plainTransaction.createdAt,
            updatedAt: plainTransaction.updatedAt,
            product: {
                idProduct: plainTransaction.idProduct,
                grade: searchProduct.dataValues.grade,
                nama: searchProduct.dataValues.nama,
                picture: searchProduct.dataValues.picture,
                pricePerKg: searchProduct.dataValues.price
            },
            buyer: {
                usernameBuyer: searchBuyer.dataValues.username,
                namaBuyer: searchBuyer.dataValues.nama || null,
                picture: searchBuyer.dataValues.photo
            }
        }
    }))
    const TransactionsAsBuyer = await Promise.all(searchMyTransactionsAsBuyer.map(async transaction => {
        const transactionDataValues = {...transaction.dataValues }
        const plainTransaction = {...transactionDataValues }
        plainTransaction.totalPrice = transactionDataValues.price + transactionDataValues.ongkir
        const idProduct = transaction.idProduct
        const searchProduct = await Product.findOne({ where: { idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Seller tidak ada')
        const usernameSeller = searchProduct.dataValues.usernameSeller
        const searchSeller = await User.findOne({ where: { username: usernameSeller } })
        if (!searchSeller) throw new ResponseError(400, 'Seller tidak ada')
        return {
            idTransaction: plainTransaction.idTransaction,
            weight: plainTransaction.weight,
            price: plainTransaction.price,
            type: plainTransaction.type,
            status: plainTransaction.status,
            noResi: plainTransaction.noResi,
            ongkir: plainTransaction.ongkir,
            datePickup: plainTransaction.datePickup,
            totalPrice: plainTransaction.price + plainTransaction.ongkir,
            createdAt: plainTransaction.createdAt,
            updatedAt: plainTransaction.updatedAt,
            product: {
                idProduct: plainTransaction.idProduct,
                grade: searchProduct.dataValues.grade,
                nama: searchProduct.dataValues.nama,
                picture: searchProduct.dataValues.picture,
                pricePerKg: searchProduct.dataValues.price
            },
            seller: {
                usernameSeller: searchSeller.dataValues.username,
                namaSeller: searchSeller.dataValues.nama || null,
                picture: searchSeller.dataValues.photo
            }
        }
    }))
    if (TransactionsAsBuyer.length === 0 && TransactionAsSeller) throw new ResponseError(404, 'Transaksi tidak tersedia')
    if (TransactionsAsBuyer.length === 0) return { seller: TransactionAsSeller, buyer: 'Transaksi tidak tersedia' }
    if (TransactionAsSeller.length === 0) return { seller: 'Transaksi tidak tersedia', buyer: TransactionsAsBuyer }
    return { seller: TransactionAsSeller, buyer: TransactionsAsBuyer }
}

const getTransactionById = async(myUsername, idTransaction) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    await checkUserAvailable(false, validMyUsername)
    const searchTransaction = await Transaction.findOne({ where: { idTransaction: validIdTransaction } })
    if (!searchTransaction) throw new ResponseError(400, 'Transaction tidak tersedia')
    const transactionDataValues = {...searchTransaction.dataValues }
    const plainTransaction = {...transactionDataValues }
    const usernameBuyer = plainTransaction.usernameBuyer
    const searchBuyer = await User.findOne({ where: { username: usernameBuyer } })
    if (!searchBuyer) throw new ResponseError(400, 'Buyer tidak ada')
    const searchProduct = await Product.findOne({ where: { idProduct: plainTransaction.idProduct } })
    if (!searchProduct) throw new ResponseError(400, 'Product tidak ada')
    const searchSeller = await User.findOne({ where: { username: searchProduct.dataValues.usernameSeller } })
    if (!searchSeller) throw new ResponseError(400, 'Seller tidak ada')
    return {
        idTransaction: plainTransaction.idTransaction,
        weight: plainTransaction.weight,
        price: plainTransaction.price,
        type: plainTransaction.type,
        status: plainTransaction.status,
        noResi: plainTransaction.noResi,
        ongkir: plainTransaction.ongkir,
        totalPrice: plainTransaction.price + plainTransaction.ongkir,
        datePickup: plainTransaction.datePickup,
        createdAt: plainTransaction.createdAt,
        updatedAt: plainTransaction.updatedAt,
        product: {
            idProduct: plainTransaction.idProduct,
            grade: searchProduct.dataValues.grade,
            nama: searchProduct.dataValues.nama,
            picture: searchProduct.dataValues.picture,
            pricePerKg: searchProduct.dataValues.price
        },
        buyer: {
            usernameBuyer: searchBuyer.dataValues.username,
            namaBuyer: searchBuyer.dataValues.nama,
            picture: searchBuyer.dataValues.photo
        },
        seller: {
            usernameSeller: searchSeller.dataValues.username,
            nama: searchSeller.dataValues.nama,
            picture: searchSeller.dataValues.photo,
        }
    }
}

const getMyTransactions = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const searchUser = await checkUserAvailable(true, validMyUsername)
    const searchMyTransactionsAsBuyer = await Transaction.findAll({ where: { usernameBuyer: searchUser.dataValues.username } })
    const searchMyTransactionsAsSeller = await Transaction.findAll({ include: Product })
    const myTransactionAsSeller = searchMyTransactionsAsSeller.filter(transaction => transaction.dataValues.product.dataValues.usernameSeller === validMyUsername)
    const TransactionAsSeller = await Promise.all(myTransactionAsSeller.map(async transaction => {
        const transactionDataValues = {...transaction.dataValues }
        const plainTransaction = {...transactionDataValues }
        const usernameBuyer = transaction.usernameBuyer
        const searchBuyer = await User.findOne({ where: { username: usernameBuyer } })
        if (!searchBuyer) throw new ResponseError(400, 'Buyer tidak ada')
        const searchProduct = await Product.findOne({ where: { idProduct: transaction.idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Product tidak ada')
        return {
            idTransaction: plainTransaction.idTransaction,
            weight: plainTransaction.weight,
            price: plainTransaction.price,
            type: plainTransaction.type,
            status: plainTransaction.status,
            noResi: plainTransaction.noResi,
            ongkir: plainTransaction.ongkir,
            datePickup: plainTransaction.datePickup,
            totalPrice: plainTransaction.price + plainTransaction.ongkir,
            createdAt: plainTransaction.createdAt,
            updatedAt: plainTransaction.updatedAt,
            product: {
                idProduct: plainTransaction.idProduct,
                grade: searchProduct.dataValues.grade,
                nama: searchProduct.dataValues.nama,
                picture: searchProduct.dataValues.picture,
                pricePerKg: searchProduct.dataValues.price
            },
            buyer: {
                usernameBuyer: searchBuyer.dataValues.username,
                namaBuyer: searchBuyer.dataValues.nama || null,
                picture: searchBuyer.dataValues.photo
            }
        }
    }))
    const TransactionsAsBuyer = await Promise.all(searchMyTransactionsAsBuyer.map(async transaction => {
        const transactionDataValues = {...transaction.dataValues }
        const plainTransaction = {...transactionDataValues }
        plainTransaction.totalPrice = transactionDataValues.price + transactionDataValues.ongkir
        const idProduct = transaction.idProduct
        const searchProduct = await Product.findOne({ where: { idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Seller tidak ada')
        const usernameSeller = searchProduct.dataValues.usernameSeller
        const searchSeller = await User.findOne({ where: { username: usernameSeller } })
        if (!searchSeller) throw new ResponseError(400, 'Seller tidak ada')
        return {
            idTransaction: plainTransaction.idTransaction,
            weight: plainTransaction.weight,
            price: plainTransaction.price,
            type: plainTransaction.type,
            status: plainTransaction.status,
            noResi: plainTransaction.noResi,
            ongkir: plainTransaction.ongkir,
            datePickup: plainTransaction.datePickup,
            totalPrice: plainTransaction.price + plainTransaction.ongkir,
            createdAt: plainTransaction.createdAt,
            updatedAt: plainTransaction.updatedAt,
            product: {
                idProduct: plainTransaction.idProduct,
                grade: searchProduct.dataValues.grade,
                nama: searchProduct.dataValues.nama,
                picture: searchProduct.dataValues.picture,
                pricePerKg: searchProduct.dataValues.price
            },
            seller: {
                usernameSeller: searchSeller.dataValues.username,
                namaSeller: searchSeller.dataValues.nama || null,
                picture: searchSeller.dataValues.photo
            }
        }
    }))
    if (TransactionsAsBuyer.length === 0 && TransactionAsSeller) throw new ResponseError(404, 'Transaksi tidak tersedia')
    if (TransactionsAsBuyer.length === 0) return { seller: TransactionAsSeller, buyer: 'Transaksi tidak tersedia' }
    if (TransactionAsSeller.length === 0) return { buyer: TransactionsAsBuyer, seller: 'Transaksi tidak tersedia' }
    return { seller: TransactionAsSeller, buyer: TransactionsAsBuyer }
}

const getTransactionAsBuyer = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const searchUser = await checkUserAvailable(true, validMyUsername)
    const searchMyTransactionsAsBuyer = await Transaction.findAll({ where: { usernameBuyer: searchUser.dataValues.username } })
    if (searchMyTransactionsAsBuyer.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    const newTransactions = await Promise.all(searchMyTransactionsAsBuyer.map(async transaction => {
        const transactionDataValues = {...transaction.dataValues }
        const plainTransaction = {...transactionDataValues }
        plainTransaction.totalPrice = transactionDataValues.price + transactionDataValues.ongkir
        const idProduct = transaction.idProduct
        const searchProduct = await Product.findOne({ where: { idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Seller tidak ada')
        const usernameSeller = searchProduct.dataValues.usernameSeller
        const searchSellerUser = await User.findOne({ where: { username: usernameSeller } })
        if (!searchSellerUser) throw new ResponseError(400, 'Seller tidak ada')
        return {
            idTransaction: plainTransaction.idTransaction,
            weight: plainTransaction.weight,
            price: plainTransaction.price,
            type: plainTransaction.type,
            status: plainTransaction.status,
            noResi: plainTransaction.noResi,
            ongkir: plainTransaction.ongkir,
            datePickup: plainTransaction.datePickup,
            totalPrice: plainTransaction.price + plainTransaction.ongkir,
            createdAt: plainTransaction.createdAt,
            updatedAt: plainTransaction.updatedAt,
            product: {
                idProduct: plainTransaction.idProduct,
                grade: searchProduct.dataValues.grade,
                nama: searchProduct.dataValues.nama,
                picture: searchProduct.dataValues.picture,
                pricePerKg: searchProduct.dataValues.price
            },
            seller: {
                usernameSeller: searchSellerUser.dataValues.username,
                namaSeller: searchSellerUser.dataValues.nama || null,
                picture: searchSellerUser.dataValues.photo
            }
        }
    }))
    return newTransactions
}

const getTransactionAsSeller = async myUsername => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    await checkUserAvailable(false, validMyUsername)
    const searchMyTransactionsAsSeller = await Transaction.findAll({ include: Product })
    const transactions = searchMyTransactionsAsSeller.filter(transaction => transaction.dataValues.product.dataValues.usernameSeller === validMyUsername)
    if (transactions.length === 0) throw new ResponseError(404, 'Transaksi tidak tersedia')
    const newTransactions = await Promise.all(transactions.map(async transaction => {
        const transactionDataValues = {...transaction.dataValues }
        const plainTransaction = {...transactionDataValues }
        plainTransaction.totalPrice = transactionDataValues.price + transactionDataValues.ongkir
        const usernameBuyer = transaction.usernameBuyer
        const searchBuyer = await User.findOne({ where: { username: usernameBuyer } })
        if (!searchBuyer) throw new ResponseError(400, 'Buyer tidak ada')
        const searchProduct = await Product.findOne({ where: { idProduct: transaction.idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Product tidak ada')
        return {
            idTransaction: plainTransaction.idTransaction,
            weight: plainTransaction.weight,
            price: plainTransaction.price,
            type: plainTransaction.type,
            status: plainTransaction.status,
            noResi: plainTransaction.noResi,
            ongkir: plainTransaction.ongkir,
            datePickup: plainTransaction.datePickup,
            totalPrice: plainTransaction.price + plainTransaction.ongkir,
            createdAt: plainTransaction.createdAt,
            updatedAt: plainTransaction.updatedAt,
            product: {
                idProduct: plainTransaction.idProduct,
                grade: searchProduct.dataValues.grade,
                nama: searchProduct.dataValues.nama,
                picture: searchProduct.dataValues.picture,
                pricePerKg: searchProduct.dataValues.price
            },
            buyer: {
                usernameBuyer: searchBuyer.dataValues.username,
                namaBuyer: searchBuyer.dataValues.nama || null,
                pictureBuyer: searchBuyer.dataValues.photo
            }
        }
    }))
    return newTransactions
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
            idProduct: validRequest.idProduct,
            usernameBuyer: searchUser.dataValues.username,
            weight: validRequest.weight,
            price: searchProduct.dataValues.price * validRequest.weight,
            type: validRequest.type === '1' && validRequest.datePickup ? '1' : '0',
            status: defaultStatus,
            datePickup: validRequest.type === '1' && validRequest.datePickup ? validRequest.datePickup : null
        }, { transaction })
        searchProduct.weight = searchProduct.weight - validRequest.weight
        await searchProduct.save({ transaction })
        await transaction.commit()
        return postTransaction
    } catch (error) {
        await transaction.rollback()
        throw new ResponseError(400, `Rollback, error: ${error.message}`)
    }
}

const putTransactionAsBuyer = async(myUsername, idTransaction, request) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    const validRequest = validate(transactionValidation.putRequestAsBuyerValidation, request)
    console.log({ validRequest })
    await checkUserAvailable(false, validMyUsername)
    const searchTranscation = await Transaction.findOne({ include: Product, where: { idTransaction: validIdTransaction, usernameBuyer: validMyUsername } })
    if (!searchTranscation) throw new ResponseError(400, 'Transaksi tidak tersedia')
    const checkStatusAvailable = validRequest.type && searchTranscation.dataValues.status === '0' ? true : false
    if (!checkStatusAvailable) throw new ResponseError(400, 'Tidak bisa mengubah status, transaksi sedang diproses')
    const beratPembelianSebelumnya = searchTranscation.dataValues.weight
    const beratPembelianSetelahnya = validRequest.weight
    const idProduct = searchTranscation.dataValues.product.dataValues.idProduct
    const weightProductNow = searchTranscation.dataValues.product.dataValues.weight
    if (validRequest.weight) {
        const searchProduct = await Product.findOne({ where: { idProduct } })
        if (!searchProduct) throw new ResponseError(400, 'Product tidak tersedia')
        if (weightProductNow + beratPembelianSebelumnya < beratPembelianSetelahnya) throw new ResponseError(400, 'Berat product tidak ada')
        searchProduct.weight = beratPembelianSebelumnya === beratPembelianSetelahnya ? searchProduct.dataValues.weight :
            beratPembelianSetelahnya > beratPembelianSebelumnya ?
            weightProductNow - (beratPembelianSetelahnya - beratPembelianSebelumnya) :
            weightProductNow + (beratPembelianSebelumnya - beratPembelianSetelahnya)
        const updateWeightProduct = await searchProduct.save()
        if (!updateWeightProduct) throw new ResponseError(400, 'Berat product gagal diupdate')
    }
    searchTranscation.price = validRequest.weight ?
        validRequest.weight * searchTranscation.dataValues.product.dataValues.price :
        searchTranscation.dataValues.putTransactionAsSeller
    searchTranscation.weight = validRequest.weight ? validRequest.weight : searchTranscation.dataValues.weight
    searchTranscation.type = validRequest.datePickup && validRequest.type === '1' ? validRequest.type : '0'
    searchTranscation.datePickup = validRequest.datePickup && validRequest.type === '1' ? validRequest.datePickup : null
    const updateTransaction = await searchTranscation.save()
    if (!updateTransaction) throw new ResponseError(400, 'Update transaksi sebagai Buyer gagal')
    const searchNewProduct = await Product.findOne({ where: { idProduct } })
    return {
        idTransaction: updateTransaction.dataValues.idTransaction,
        idProduct: updateTransaction.dataValues.idProduct,
        usernameBuyer: updateTransaction.dataValues.usernameBuyer,
        weight: updateTransaction.dataValues.weight,
        price: updateTransaction.dataValues.price,
        totalPrice: updateTransaction.dataValues.price + updateTransaction.dataValues.ongkir,
        type: updateTransaction.dataValues.type,
        status: updateTransaction.dataValues.status,
        noResi: updateTransaction.dataValues.noResi,
        ongkir: updateTransaction.dataValues.ongkir,
        datePickup: updateTransaction.dataValues.datePickup,
        createdAt: updateTransaction.dataValues.createdAt,
        updatedAt: updateTransaction.dataValues.updatedAt,
        product: searchNewProduct
    }
}

const putTransactionAsSeller = async(myUsername, idTransaction, request) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    const validRequest = validate(transactionValidation.putRequestAsSellerValidation, request)
    await checkUserAvailable(false, validMyUsername)
    const searchTranscation = await Transaction.findOne({ include: Product, where: { idTransaction: validIdTransaction } })
    if (!searchTranscation) throw new ResponseError(400, 'Transaksi tidak tersedia')
    const checkTypeIsDiantar = searchTranscation.dataValues.type === '0' ? true : false
    searchTranscation.status = validRequest.status && validRequest.status === '1' ? validRequest.status : searchTranscation.dataValues.status
    searchTranscation.noResi = validRequest.noResi && checkTypeIsDiantar ? validRequest.noResi : ''
    searchTranscation.ongkir = validRequest.ongkir && checkTypeIsDiantar ? validRequest.ongkir : 0
    const updateTransaction = await searchTranscation.save()
    if (!updateTransaction) throw new ResponseError(400, 'Update transaksi sebagai Seller gagal')
    const searchNewProduct = await Product.findOne({ where: { idProduct: updateTransaction.dataValues.idProduct } })
    return {
        idTransaction: updateTransaction.dataValues.idTransaction,
        idProduct: updateTransaction.dataValues.idProduct,
        usernameBuyer: updateTransaction.dataValues.usernameBuyer,
        weight: updateTransaction.dataValues.weight,
        price: updateTransaction.dataValues.price,
        totalPrice: updateTransaction.dataValues.price + updateTransaction.dataValues.ongkir,
        type: updateTransaction.dataValues.type,
        status: updateTransaction.dataValues.status,
        noResi: updateTransaction.dataValues.noResi,
        ongkir: updateTransaction.dataValues.ongkir,
        datePickup: updateTransaction.dataValues.datePickup,
        createdAt: updateTransaction.dataValues.createdAt,
        updatedAt: updateTransaction.dataValues.updatedAt,
        product: searchNewProduct
    }
}

const rejectTransaction = async myUsername => {}

const deleteTransactions = async myUsername => {}

const deleteTransaction = async(myUsername, idTransaction) => {
    const validMyUsername = validate(transactionValidation.usernameValidation, myUsername)
    const validIdTransaction = validate(transactionValidation.idTransactionValidation, idTransaction)
    await checkUserAvailable(false, validMyUsername)
    const searchTransaction = await Transaction.findOne({ where: { idTransaction: validIdTransaction } })
    if (!searchTransaction) throw new ResponseError(400, 'Transaksi tidak tersedia')
    const deletedTransaction = await Transaction.destroy({
        where: {
            idTransaction: searchTransaction.dataValues.idTransaction,
            usernameBuyer: searchTransaction.dataValues.usernameBuyer,
            status: '0'
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
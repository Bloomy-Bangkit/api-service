const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')
const fs = require('fs').promises
const path = require('path')
const { Storage } = require('@google-cloud/storage')
const Product = require('./product-model.js')
const Favorite = require('../favorite/favorite-model.js')
const validate = require('../middleware/validation.js')
const ResponseError = require('../error/response-error.js')
const productValidation = require('./product-validation.js')
const checkUserAvaiable = require('../utils/check-user-available.js')
const checkProductAvailabe = require('../utils/check-product-available.js')

const keyFilename = path.join(__dirname, '../../credentials/bangkitcapstone-bloomy-53eae279350a.json')
const GCS = new Storage({ keyFilename })
const bucketName = 'bangkitcapstone-bloomy-bucket'

const getProducts = async myUsername => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    await checkUserAvaiable(false, validMyUsername)
    const searchProducts = await Product.findAll({ include: [{ model: Favorite, required: false, }] })
    if (searchProducts.length === 0) throw new ResponseError(404, 'Data product tidak tersedia')
    const products = searchProducts.map(product => ({
        ...product.toJSON(),
        isFavorite: product.favorites.some(fav => fav.idProduct === product.idProduct && fav.usernameBuyer === validMyUsername),
    }))
    const productsAfterFilter = products.map(product => {
        return {
            idProduct: product.idProduct,
            usernameSeller: product.usernameSeller,
            picture: product.picture,
            nama: product.nama,
            description: product.description,
            grade: product.grade,
            price: product.price,
            weight: product.weight,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            favorite: product.isFavorite,
        }
    })
    return productsAfterFilter
}

const getProductByUsername = async(myUsername, usernameSeller) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validUsernameSeller = validate(productValidation.usernameValidation, usernameSeller)
    await checkUserAvaiable(false, validMyUsername)
    const searchProductsUser = await Product.findAll({ include: [{ model: Favorite, required: false, }], where: { usernameSeller: validUsernameSeller } })
    if (searchProductsUser.length === 0) throw new ResponseError(404, 'Data product tidak tersedia')
    const products = searchProductsUser.map(product => ({
        ...product.toJSON(),
        isFavorite: product.favorites.some(fav => fav.idProduct === product.idProduct && fav.usernameBuyer === validMyUsername),
    }))
    const productsAfterFilter = products.map(product => {
        return {
            idProduct: product.idProduct,
            usernameSeller: product.usernameSeller,
            picture: product.picture,
            nama: product.nama,
            description: product.description,
            grade: product.grade,
            price: product.price,
            weight: product.weight,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            favorite: product.isFavorite,
        }
    })
    return productsAfterFilter
}

const getProductById = async(myUsername, idProduct) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    await checkUserAvaiable(false, validMyUsername)
    const searchProduct = await Product.findOne({ include: [{ model: Favorite, required: false, }], where: { idProduct: validIdProduct } })
    if (!searchProduct) throw new ResponseError(404, 'Data product tidak tersedia')
    searchProduct.dataValues.isFavorite = searchProduct.dataValues.favorites.some(fav => fav.idProduct === searchProduct.idProduct && fav.usernameBuyer === validMyUsername)
    return {
        idProduct: searchProduct.dataValues.idProduct,
        usernameSeller: searchProduct.dataValues.usernameSeller,
        picture: searchProduct.dataValues.picture,
        nama: searchProduct.dataValues.nama,
        description: searchProduct.dataValues.description,
        grade: searchProduct.dataValues.grade,
        price: searchProduct.dataValues.price,
        weight: searchProduct.dataValues.weight,
        createdAt: searchProduct.dataValues.createdAt,
        updatedAt: searchProduct.dataValues.updatedAt,
        favorite: searchProduct.dataValues.isFavorite,
    }
}

const getProductByName = async(myUsername, nama) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validNameProduct = validate(productValidation.nameValidation, nama)
    await checkUserAvaiable(false, validMyUsername)
    const searchProduct = await Product.findAll({
        include: [{ model: Favorite, required: false, }],
        where: {
            nama: {
                [Op.like]: `%${validNameProduct}%`
            }
        }
    })
    if (searchProduct.length === 0) throw new ResponseError(404, 'Data product tidak tersedia')
    const products = searchProduct.map(product => ({
        ...product.toJSON(),
        isFavorite: product.favorites.some(fav => fav.idProduct === product.idProduct && fav.usernameBuyer === validMyUsername),
    }))
    const productsAfterFilter = products.map(product => {
        return {
            idProduct: product.idProduct,
            usernameSeller: product.usernameSeller,
            picture: product.picture,
            nama: product.nama,
            description: product.description,
            grade: product.grade,
            price: product.price,
            weight: product.weight,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            favorite: product.isFavorite,
        }
    })
    return productsAfterFilter
}

const getProductByGrade = async(myUsername, grade) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validGrade = validate(productValidation.gradeValidation, grade)
    await checkUserAvaiable(false, validMyUsername)
    const searchProduct = await Product.findAll({
        include: [{ model: Favorite, required: false, }],
        where: { grade: validGrade }
    })
    if (searchProduct.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    const products = searchProduct.map(product => ({
        ...product.toJSON(),
        isFavorite: product.favorites.some(fav => fav.idProduct === product.idProduct && fav.usernameBuyer === validMyUsername),
    }))
    const productsAfterFilter = products.map(product => {
        return {
            idProduct: product.idProduct,
            usernameSeller: product.usernameSeller,
            picture: product.picture,
            nama: product.nama,
            description: product.description,
            grade: product.grade,
            price: product.price,
            weight: product.weight,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            favorite: product.isFavorite,
        }
    })
    return productsAfterFilter
}

const getMyProducts = async myUsername => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    await checkUserAvaiable(false, validMyUsername)
    const searchMyProducts = await Product.findAll({ where: { usernameSeller: myUsername } })
    if (searchMyProducts.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    return searchMyProducts
}

const getTotalMyProducts = async myUsername => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    await checkUserAvaiable(false, validMyUsername)
    const searchMyProducts = await Product.count({ where: { usernameSeller: myUsername } })
    return searchMyProducts
}

const postProduct = async(myUsername, filePath, request) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validRequest = validate(productValidation.postProductValidation, request)
    await checkUserAvaiable(false, validMyUsername)
    const fileName = path.basename(filePath)
    const destFileName = `service/product/${fileName}`
    await GCS.bucket(bucketName).upload(filePath, { destination: destFileName, })
    const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`
    const defaultPicture = 'https://storage.googleapis.com/bangkitcapstone-bloomy-bucket/service/product/default-product.jpg'
    const productCreated = await Product.create({
        idProduct: uuidv4(),
        usernameSeller: validMyUsername,
        picture: url || defaultPicture,
        nama: validRequest.nama,
        description: validRequest.description,
        grade: validRequest.grade,
        price: validRequest.price,
        weight: validRequest.weight
    })
    if (!productCreated) throw new ResponseError(400, 'Tambah product gagal')
    fs.unlink(filePath)
    return {
        idProduct: productCreated.idProduct,
        usernameSeller: productCreated.usernameSeller,
        picture: productCreated.picture,
        nama: productCreated.nama,
        description: productCreated.description,
        grade: productCreated.grade,
        price: productCreated.price,
        weight: productCreated.weight
    }
}

const updateProduct = async(myUsername, idProduct, request) => {
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    const vaiidMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validRequest = validate(productValidation.updateProductValidation, request)
    await checkUserAvaiable(false, vaiidMyUsername)
    const searchProduct = await Product.findOne({ where: { idProduct: validIdProduct, usernameSeller: vaiidMyUsername } })
    if (!searchProduct) throw new ResponseError(400, 'Product tidak ditemukan')
    searchProduct.nama = validRequest.nama || searchProduct.dataValues.nama
    searchProduct.description = validRequest.description || searchProduct.dataValues.description
    searchProduct.grade = validRequest.grade || searchProduct.dataValues.grade
    searchProduct.price = validRequest.price || searchProduct.dataValues.price
    searchProduct.weight = validRequest.weight || searchProduct.dataValues.weight
    const updatedProduct = await searchProduct.save()
    if (!updatedProduct) throw new ResponseError(400, 'Gagal update product')
    return updatedProduct
}

const updatePhotoProduct = async(myUsername, idProduct, filePath) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    await checkUserAvaiable(false, validMyUsername)
    const searchProduct = await Product.findOne({ where: { idProduct: validIdProduct, usernameSeller: validMyUsername } })
    if (!searchProduct) throw new ResponseError(400, 'Product tidak ditemukan')
    const fileName = path.basename(filePath)
    const destFileName = `service/product/${fileName}`
    await GCS.bucket(bucketName).upload(filePath, { destination: destFileName, })
    const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`
    searchProduct.picture = url
    const updatedProduct = await searchProduct.save()
    if (!updatedProduct) throw new ResponseError(400, 'Gagal update photo product')
    fs.unlink(filePath)
    return updatedProduct
}

const deleteProducts = async myUsername => {}

const deleteProduct = async(myUsername, idProduct) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    const searchUser = await checkUserAvaiable(true, validMyUsername)
    const searchProduct = await Product.findOne({
        where: { idProduct: validIdProduct, usernameSeller: searchUser.dataValues.username }
    })
    if (!searchProduct) throw new ResponseError(400, 'Product tidak tersedia')
    const deletedProduct = await Product.destroy({
        where: {
            idProduct: searchProduct.dataValues.idProduct,
            usernameSeller: searchProduct.dataValues.usernameSeller
        }
    })
    if (deletedProduct.length === 0) throw new ResponseError(400, 'Gagal delete product')
    return { idProduct: validIdProduct, isDelete: deletedProduct === 1 ? true : false }
}

module.exports = {
    getProducts,
    getProductByUsername,
    getProductById,
    getProductByName,
    getProductByGrade,
    getMyProducts,
    getTotalMyProducts,
    postProduct,
    updateProduct,
    updatePhotoProduct,
    deleteProducts,
    deleteProduct
}
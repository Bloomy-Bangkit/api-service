const { v4: uuidv4 } = require('uuid')
const { Op } = require('sequelize')
const fs = require('fs').promises
const path = require('path')
const { Storage } = require('@google-cloud/storage')
const Product = require('./product-model.js')
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
    const searchProducts = await Product.findAll()
    if (searchProducts.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    return searchProducts
}

const getProductByUsername = async(myUsername, usernameSeller) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validUsernameSeller = validate(productValidation.usernameValidation, usernameSeller)
    await checkUserAvaiable(false, validMyUsername)
    const searchProductsUser = await Product.findAll({ where: { usernameSeller: validUsernameSeller } })
    if (searchProductsUser.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    return searchProductsUser
}

const getProductById = async(myUsername, idProduct) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    await checkUserAvaiable(false, validMyUsername)
    const searchProduct = await checkProductAvailabe(true, validIdProduct)
    return searchProduct.dataValues
}

const getProductByName = async(myUsername, nama) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validNameProduct = validate(productValidation.nameValidation, nama)
    await checkUserAvaiable(false, validMyUsername)
    const searchProduct = await Product.findAll({
        where: {
            nama: {
                [Op.like]: `%${validNameProduct}%`
            }
        }
    })
    if (searchProduct.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    const products = searchProduct.map(product => product.dataValues)
    return products
}

const getProductByGrade = async(myUsername, grade) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validGrade = validate(productValidation.gradeValidation, grade)
    await checkUserAvaiable(false, validMyUsername)
    const searchProduct = await Product.findAll({ where: { grade: validGrade } })
    if (searchProduct.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    const products = searchProduct.map(product => product.dataValues)
    return products
}

const getMyProducts = async myUsername => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    await checkUserAvaiable(false, validMyUsername)
    const searchMyProducts = await Product.findAll({ where: { usernameSeller: myUsername } })
    if (searchMyProducts.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
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
    if (!productCreated) throw new ResponseError(400, 'Upload product gagal')
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
    await checkUserAvaiable(false, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    const validRequest = validate(productValidation.updateProductValidation, request)
    const searchProduct = await Product.findOne({ where: { idProduct: validIdProduct, usernameSeller: myUsername } })
    if (!searchProduct) throw new ResponseError(400, 'Product tidak ditemukan')
    searchProduct.picture = validRequest.picture || searchProduct.dataValues.picture
    searchProduct.nama = validRequest.nama || searchProduct.dataValues.nama
    searchProduct.description = validRequest.description || searchProduct.dataValues.description
    searchProduct.grade = validRequest.grade || searchProduct.dataValues.grade
    searchProduct.price = validRequest.price || searchProduct.dataValues.price
    searchProduct.weight = validRequest.weight || searchProduct.dataValues.weight
    const updatedProduct = await searchProduct.save()
    if (!updatedProduct) throw new ResponseError(400, 'Update product gagal')
    return updatedProduct
}

const deleteProducts = async myUsername => {}

const deleteProduct = async(myUsername, idProduct) => {
    const validMyUsername = validate(productValidation.usernameValidation, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    const searchUser = await checkUserAvaiable(true, validMyUsername)
    const searchProduct = await Product.findOne({
        where: { idProduct: validIdProduct, usernameSeller: searchUser.dataValues.usernameSeller }
    })
    if (!searchProduct) throw new ResponseError(404, 'Product tidak tersedia')
    const deletedProduct = await Product.destroy({
        where: {
            idProduct: searchProduct.dataValues.idProduct,
            usernameSeller: searchProduct.dataValues.usernameSeller
        }
    })
    if (deletedProduct.length === 0) throw new ResponseError(400, 'Product gagal dihapus')
    return { idProduct: validIdProduct, isDelete: deletedProduct === 1 ? true : false }
}

module.exports = {
    getProducts,
    getProductByUsername,
    getProductById,
    getProductByName,
    getProductByGrade,
    getMyProducts,
    postProduct,
    updateProduct,
    deleteProducts,
    deleteProduct
}
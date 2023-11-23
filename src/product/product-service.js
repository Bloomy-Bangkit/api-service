const { v4: uuidv4 } = require('uuid')
const Product = require('./product-model.js')
const validate = require('../middleware/validation.js')
const ResponseError = require('../error/response-error.js')
const productValidation = require('./product-validation.js')
const checkUserAvaiable = require('../utils/check-user-available.js')

const getProducts = async myUsername => {
    await checkUserAvaiable(false, myUsername)
    const searchProducts = await Product.findAll()
    if (searchProducts.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    return searchProducts
}

const getProductByUsername = async(myUsername, username) => {
    await checkUserAvaiable(false, myUsername)
    const validUsername = validate(productValidation.usernameValidation, username)
    const searchProductsUser = await Product.findAll({ where: { usernameSeller: validUsername } })
    if (searchProductsUser.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    return searchProductsUser
}

const getProductById = async(myUsername, idProduct) => {
    await checkUserAvaiable(false, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    const searchProduct = await Product.findOne({ where: { idProduct: validIdProduct } })
    if (!searchProduct) throw new ResponseError(404, 'Product tidak ditemukan')
    return searchProduct.dataValues
}

const getMyProduct = async myUsername => {
    await checkUserAvaiable(false, myUsername)
    const searchMyProducts = await Product.findAll({ where: { usernameSeller: myUsername } })
    if (searchMyProducts.length === 0) throw new ResponseError(404, 'Product tidak ditemukan')
    return searchMyProducts
}

const postProduct = async(myUsername, request) => {
    await checkUserAvaiable(false, myUsername)
    const validRequest = validate(productValidation.postProductValidation, request)
    const idProduct = uuidv4()
    const productCreated = await Product.create({
        idProduct,
        usernameSeller: validMyUsername,
        picture: validRequest.picture || 'https://storage.googleapis.com/bangkitcapstone-bloomy-bucket/a.jpg',
        nama: validRequest.nama,
        description: validRequest.description,
        grade: validRequest.grade,
        price: validRequest.price,
        weight: validRequest.weight
    })
    if (!productCreated) throw new ResponseError(400, 'Upload product gagal')
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
    searchProduct.updatedAt = new Date()
    const updatedProduct = await searchProduct.save()
    if (!updatedProduct) throw new ResponseError(400, 'Update product gagal')
    return updatedProduct
}

const deleteProduct = async(myUsername, idProduct) => {
    await checkUserAvaiable(false, myUsername)
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    const searchProduct = await Product.findOne({ where: { idProduct: validIdProduct } })
    if (!searchProduct) throw new ResponseError(400, 'Product tidak ditemukan')
    const deletedProduct = await Product.destroy({ where: { idProduct: validIdProduct } })
    if (deletedProduct === 0) throw new ResponseError(400, 'Product gagal dihapus')
    return { idProduct: validIdProduct, isDelete: deletedProduct === 1 ? true : false }
}

module.exports = {
    getProducts,
    getProductByUsername,
    getProductById,
    getMyProduct,
    postProduct,
    updateProduct,
    deleteProduct
}
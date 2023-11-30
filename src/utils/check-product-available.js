const validate = require('../middleware/validation.js')
const productValidation = require('../product/product-validation.js')
const Product = require('../product/product-model.js')
const ResponseError = require('../error/response-error.js')

const checkProductAvailabe = async(isRetrun, idProduct) => {
    const validIdProduct = validate(productValidation.idProductValidation, idProduct)
    const searchProduct = await Product.findOne({ where: { idProduct: validIdProduct } })
    if (!searchProduct) throw new ResponseError(404, 'Product tidak tersedia')
    if (isRetrun) return searchUser
}

module.exports = checkProductAvailabe
const { v4: uuidv4 } = require('uuid')
const Cart = require('../cart/cart-model.js')
const ResponseError = require('../error/response-error.js')
const validate = require('../middleware/validation.js')
const cartValidation = require('./cart-validation.js')
const checkUserAvaiable = require('../utils/check-user-available.js')
const checkProductAvaiable = require('../utils/check-product-available.js')

const getCarts = async myUsername => {
    const validMyUsername = validate(cartValidation.usernameValidation, myUsername)
    await checkUserAvaiable(false, validMyUsername)
    const searchCarts = await Cart.findAll({ where: { usernameBuyer: validMyUsername } })
    if (searchCarts.length === 0) throw new ResponseError(404, 'Cart tidak tersedia')
    return searchCarts
}

const getCart = async myUsername => {}

const getMyCart = async myUsername => {}

const postCart = async(myUsername, idProduct) => {
    const validMyUsername = validate(cartValidation.usernameValidation, myUsername)
    const validIdProduct = validate(cartValidation.idProductValidation, idProduct)
    const searchUser = await checkUserAvaiable(true, validMyUsername)
    const searchProduct = await checkProductAvaiable(true, validIdProduct)
    const idCart = uuidv4()
    const cartCreated = await Cart.create({
        idCart,
        idProduct: searchProduct.dataValues.idProduct,
        usernameBuyer: searchUser.dataValues.username
    })
    if (!cartCreated) throw new ResponseError(400, 'Tambah product ke cart gagal')
    return { idCart: cartCreated.idCart, idProduct: cartCreated.idProduct, usernameBuyer: cartCreated.usernameBuyer }
}

const deleteCarts = async myUsername => {}

const deleteCart = async(myUsername, idCart) => {
    const validMyUsername = validate(cartValidation.usernameValidation, myUsername)
    const validIdCart = validate(cartValidation.idCartValidation, idCart)
    const searchUser = await checkUserAvaiable(true, validMyUsername)
    const searchCart = await Cart.findOne({
        where: {
            idCart: validIdCart,
            usernameBuyer: searchUser.dataValues.usernameBuyer
        }
    })
    if (!searchCart) return ResponseError(404, 'Cart tidak tersedia')
    const deleteCart = await Cart.destroy({
        where: {
            idCart: searchCart.dataValues.idCart,
            usernameBuyer: searchCart.dataValues.usernameBuyer
        }
    })
    if (deleteCart.length === 0) throw new ResponseError(400, 'Product gagal dihapus')
    return { idCart: validIdCart, isDelete: deleteCart === 1 ? true : false }
}

module.exports = {
    getCarts,
    getCart,
    getMyCart,
    postCart,
    deleteCarts,
    deleteCart
}
const { v4: uuidv4 } = require('uuid')
const ResponseError = require('../error/response-error.js')
const User = require('../user/user-model.js')
const Product = require('../product/product-model.js')
const Favorite = require('./favorite-model.js')
const validate = require('../middleware/validation.js')
const favoriteValidation = require('./favorite-validation.js')
const checkUserAvaiable = require('../utils/check-user-available.js')
const checkProductAvaiable = require('../utils/check-product-available.js')

const getFavorites = async myUsername => {
    const validUsername = await validate(favoriteValidation.usernameValidation, myUsername)
    await checkUserAvaiable(false, validUsername)
    const searchFavorites = await Favorite.findAll()
    if (searchFavorites.length === 0) throw new ResponseError(404, 'Favorite tidak tersedia')
    return searchFavorites
}

const getFavoriteByUsername = async(myUsername, usernameBuyer) => {
    const validUsername = await validate(favoriteValidation.usernameValidation, myUsername)
    const validUsernameBuyer = await validate(favoriteValidation.usernameValidation, usernameBuyer)
    await checkUserAvaiable(false, validUsername)
    const searchUsernameBuyer = await checkUserAvaiable(true, validUsernameBuyer)
    const searchFavorite = await Favorite.findAll({ where: { usernameBuyer: searchUsernameBuyer.dataValues.username } })
    if (searchFavorite.length === 0) throw new ResponseError(404, 'Favorite tidak tersedia')
    return searchFavorite
}

const getFavoriteById = async(myUsername, idFavorite) => {
    const validUsername = await validate(favoriteValidation.usernameValidation, myUsername)
    const validIdFavorite = await validate(favoriteValidation.idFavoriteValidation, idFavorite)
    await checkUserAvaiable(false, validUsername)
    const searchFavorite = await Favorite.findOne({ where: { idFavorite: validIdFavorite } })
    if (!searchFavorite) throw new ResponseError(404, 'Favorite tidak tersedia')
    return searchFavorite
}

const getMyFavorite = async myUsername => {
    const validUsername = await validate(favoriteValidation.usernameValidation, myUsername)
    const searchUser = await checkUserAvaiable(false, validUsername)
    const searchMyFavorite = await Favorite.findAll({ where: { usernameBuyer: searchUser.dataValues.username } })
    if (searchMyFavorite.length === 0) throw new ResponseError(404, 'Favorite tidak tersedia')
    return searchMyFavorite
}

const postFavorite = async(myUsername, idProduct) => {
    const validUsername = await validate(favoriteValidation.usernameValidation, myUsername)
    const validIdProduct = await validate(favoriteValidation.idProductValidation, idProduct)
    const searchUser = await checkUserAvaiable(true, validUsername)
    const searchProduct = await checkProductAvaiable(true, validIdProduct)
    const searchFavoriteIsAvailable = await Favorite.findOne({ where: { idProduct, usernameBuyer: validUsername } })
    if (searchFavoriteIsAvailable) throw new ResponseError(400, 'Product sudah dalam favorite')
    const favoriteCreated = await Favorite.create({
        idFavorite: uuidv4(),
        idProduct: searchProduct.dataValues.idProduct,
        usernameBuyer: searchUser.dataValues.username
    })
    if (!favoriteCreated) throw new ResponseError(400, 'Tambah favorite gagal')
    return {
        idFavorite: favoriteCreated.idFavorite,
        idProduct: favoriteCreated.idProduct,
        usernameBuyer: searchUser.dataValues.username
    }
}

const deleteFavorites = async myUsername => {}

const deleteFavorite = async(myUsername, idFavorite) => {
    const validMyUsername = validate(favoriteValidation.usernameValidation, myUsername)
    const validIdFavorite = validate(favoriteValidation.idFavoriteValidation, idFavorite)
    const searchUser = await checkUserAvaiable(true, validMyUsername)
    const searchFavorite = await Favorite.findOne({
        where: { idFavorite: validIdFavorite, usernameSeller: searchUser.dataValues.username }
    })
    if (!searchFavorite) throw new ResponseError(404, 'Favorite tidak tersedia')
    const deleteFavorite = await Product.destroy({
        where: {
            idFavorite: searchUser.dataValues.idFavorite,
            usernameSeller: searchUser.dataValues.usernameSeller
        }
    })
    if (deleteFavorite.length === 0) throw new ResponseError(400, 'Favorite gagal dihapus')
    return { idFavorite: validIdFavorite, isDelete: deleteFavorite === 1 ? true : false }
}

module.exports = {
    getFavorites,
    getFavoriteByUsername,
    getFavoriteById,
    getMyFavorite,
    postFavorite,
    deleteFavorites,
    deleteFavorite
}
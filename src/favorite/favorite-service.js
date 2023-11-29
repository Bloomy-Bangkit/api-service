const { v4: uuidv4 } = require('uuid')
const ResponseError = require('../middleware/error-middleware.js')
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
    if (searchFavorites.lenght === 0) throw new ResponseError(404, 'Favorite tidak tersedia')
    return searchFavorites
}

const getFavorite = async(myUsername, usernameBuyer) => {

}

const getMyFavorite = async myUsername => {

}

const postFavorite = async myUsername => {

}

const deleteFavorite = async myUsername => {

}

module.exports = {
    getFavorite,
    getFavorites,
    getMyFavorite,
    postFavorite,
    deleteFavorite
}
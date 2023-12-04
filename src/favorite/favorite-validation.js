const Joi = require('joi')

const usernameValidation = Joi.string().max(255).required()
const idProductValidation = Joi.string().max(255).required()
const idFavoriteValidation = Joi.string().max(255).required()

module.exports = {
    usernameValidation,
    idProductValidation,
    idFavoriteValidation
}
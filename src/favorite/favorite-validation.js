const Joi = require('joi')

const usernameValidation = Joi.string().max(255).required()

module.exports = {
    usernameValidation
}
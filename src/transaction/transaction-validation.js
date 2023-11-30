const Joi = require('joi')

const usernameValidation = Joi.string().max(255).required()

const postTransactionValidation = Joi.object({
    idProduct: Joi.string().max(255).required(),
    weight: Joi.string().max(255).required(),
    price: Joi.string().max(255).required(),
    type: Joi.string().max(255).required()
})






module.exports = {
    usernameValidation,
    postTransactionValidation,
}
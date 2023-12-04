const Joi = require('joi')

const usernameValidation = Joi.string().max(255).required()
const idTransactionValidation = Joi.string().max(255).required()

const postTransactionValidation = Joi.object({
    type: Joi.string().max(1).required(),
    idProduct: Joi.string().max(255).required(),
    weight: Joi.number().positive().required().allow(0),
    datePickup: Joi.date().optional().allow('')
})

const putRequestAsBuyerValidation = Joi.object({
    type: Joi.string().max(1).optional().allow(''),
    weight: Joi.number().positive().optional().allow(0),
    datePickup: Joi.date().optional().allow('')
})

const putRequestAsSellerValidation = Joi.object({
    status: Joi.string().max(1).optional().allow(''),
    noResi: Joi.string().max(255).optional().allow(''),
    ongkir: Joi.number().positive().optional().allow(0)
})

module.exports = {
    usernameValidation,
    postTransactionValidation,
    idTransactionValidation,
    putRequestAsBuyerValidation,
    putRequestAsSellerValidation
}
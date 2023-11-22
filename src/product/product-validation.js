const Joi = require('joi')

const idProductValidation = Joi.string().max(255).required()
const usernameValidation = Joi.string().max(255).required()

const postProductValidation = Joi.object({
    picture: Joi.string().max(255).optional().allow(''),
    nama: Joi.string().max(255).required(),
    description: Joi.string().max(255).optional().allow(''),
    grade: Joi.string().max(1).required(),
    price: Joi.number().required(),
    weight: Joi.number().required()
})

const updateProductValidation = Joi.object({
    picture: Joi.string().max(255).optional().allow(''),
    nama: Joi.string().max(255).optional().allow(''),
    description: Joi.string().max(255).optional().allow(''),
    grade: Joi.string().max(1).optional().allow(''),
    price: Joi.number().optional().allow(''),
    weight: Joi.number().optional().allow('')
})

module.exports = {
    idProductValidation,
    usernameValidation,
    postProductValidation,
    updateProductValidation
}
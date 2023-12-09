const Joi = require('joi')

const idProductValidation = Joi.string().max(255).required()
const usernameValidation = Joi.string().max(255).required()
const nameValidation = Joi.string().max(255).required()
const gradeValidation = Joi.string().max(1).required()

const postProductValidation = Joi.object({
    nama: Joi.string().max(255).required(),
    grade: Joi.string().max(1).required(),
    description: Joi.string().max(255).optional().allow(''),
    price: Joi.number().positive().required(),
    weight: Joi.number().positive().required(),
})

const updateProductValidation = Joi.object({
    nama: Joi.string().max(255).optional().allow(''),
    grade: Joi.string().max(1).optional().allow(''),
    description: Joi.string().max(255).optional().allow(''),
    price: Joi.number().positive().optional().allow(0),
    weight: Joi.number().positive().optional().allow(0)
})

module.exports = {
    idProductValidation,
    usernameValidation,
    nameValidation,
    gradeValidation,
    postProductValidation,
    updateProductValidation
}
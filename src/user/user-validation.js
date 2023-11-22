const Joi = require('joi')

const emailValidation = Joi.string().max(255).required()

const updateUserValidation = Joi.object({
    nama: Joi.string().max(255).optional().allow(''),
    nohp: Joi.string().max(16).optional().allow(''),
    alamat: Joi.string().max(255).optional().allow(''),
    description: Joi.string().max(255).optional().allow('')
})

const updatePasswordValidation = Joi.object({
    oldPassword: Joi.string().max(255).required(),
    newPassword: Joi.string().max(255).required(),
    confirmNewPassword: Joi.string().max(255).required()
})

module.exports = {
    emailValidation,
    updateUserValidation,
    updatePasswordValidation
}
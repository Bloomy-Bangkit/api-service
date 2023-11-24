const Joi = require('joi')

const registerValidation = Joi.object({
    email: Joi.string().max(255).required(),
    username: Joi.string().max(100).required(),
    password: Joi.string().max(255).required(),
    confirmPassword: Joi.string().max(255).required()
})

const loginValidation = Joi.object({
    email: Joi.string().max(255).required(),
    password: Joi.string().max(255).required()
})

const tokenValidation = Joi.string().max(255).required()

module.exports = {
    loginValidation,
    registerValidation,
    tokenValidation
}
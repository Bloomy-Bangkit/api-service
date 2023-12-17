const Joi = require('joi')

const cuacaValidation = Joi.object({
    lat: Joi.number(),
    long: Joi.number()
})

module.exports = {
    cuacaValidation
}
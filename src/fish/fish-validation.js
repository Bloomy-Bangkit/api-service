const Joi = require('joi')

const username = Joi.string().max(255).required()
const idFish = Joi.string().max(255).required()

const postFish = Joi.object({
    nama: Joi.string().max(255).required(),
    price: Joi.number().positive().required(),
})

const putFish = Joi.object({
    nama: Joi.string().max(255).optional(),
    price: Joi.number().positive().optional(),
})

module.exports = {
    username,
    idFish,
    postFish,
    putFish
}
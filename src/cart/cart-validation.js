// const postProductValidation = Joi.object({
//     nama: Joi.string().max(255).required(),
//     description: Joi.string().max(255).optional().allow(''),
//     grade: Joi.string().max(1).required(),
//     price: Joi.number().required(),
//     weight: Joi.number().required()
// })


const usernameValidation = Joi.string().max(255).required()
const idProductValidation = Joi.string().max(255).required()
const idCartValidation = Joi.string().max(255).required()



module.exports = {
    usernameValidation,
    idProductValidation,
    idCartValidation
}
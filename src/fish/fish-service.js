const { v4: uuidv4 } = require('uuid')
const Fish = require('./fish-model.js')
const validate = require('../middleware/validation.js')
const fishValidation = require('./fish-validation.js')
const ResponseError = require('../error/response-error.js')
const checkUserAvaiable = require('../utils/check-user-available.js')

const getFishs = async myUsername => {
    const validUsername = validate(fishValidation.username, myUsername)
    await checkUserAvaiable(false, validUsername)
    const searchFishs = await Fish.findAll()
    if (searchFishs.length === 0) throw new ResponseError(404, 'Data fish tidak tersedia')
    return searchFishs
}

const getFishId = async(myUsername, id) => {
    const validUsername = validate(fishValidation.username, myUsername)
    const validIdFish = validate(fishValidation.idFish, id)
    await checkUserAvaiable(false, validUsername)
    const searchFish = await Fish.findOne({ where: { idFish: validIdFish } })
    if (!searchFish) throw new ResponseError(404, 'Data fish tidak tersedia')
    return searchFish
}

const postFish = async(myUsername, request) => {
    const validUsername = validate(fishValidation.username, myUsername)
    const validRequest = validate(fishValidation.postFish, request)
    await checkUserAvaiable(false, validUsername)
    const fishCreate = await Fish.create({
        idFish: uuidv4(),
        nama: validRequest.nama,
        price: validRequest.price,
    })
    if (!fishCreate) throw new ResponseError(400, 'Gagal tambah ikan')
    return {
        idFish: fishCreate.idFish,
        nama: fishCreate.nama,
        price: fishCreate.price,
    }
}

const putFish = async(myUsername, id, request) => {
    const validUsername = validate(fishValidation.username, myUsername)
    const validIdFish = validate(fishValidation.idFish, id)
    const validRequest = validate(fishValidation.postFish, request)
    await checkUserAvaiable(false, validUsername)
    const searchFish = await Fish.findOne({ where: { idFish: validIdFish } })
    if (!searchFish) throw new ResponseError(400, 'Fish tidak tersedia')
    searchFish.nama = validRequest.nama || searchFish.dataValues.nama
    searchFish.price = validRequest.price || searchFish.dataValues.price
    const updateFish = await searchFish.save()
    if (!updateFish) throw new ResponseError(400, 'Gagal update fish')
    return updateFish
}

const deleteFish = async(myUsername, id) => {
    const validUsername = validate(fishValidation.username, myUsername)
    const validIdFish = validate(fishValidation.idFish, id)
    await checkUserAvaiable(false, validUsername)
    const searchFish = await Fish.findOne({
        where: { idFish: validIdFish }
    })
    if (!searchFish) throw new ResponseError(400, 'Fish tidak tersedia')
    const deleteFish = await Fish.destroy({
        where: { idFish: validIdFish }
    })
    if (deleteFish.length === 0) throw new ResponseError(400, 'Gagal delete fish')
    return { idFish: validIdFish, isDelete: deleteFish === 1 ? true : false }
}

module.exports = {
    getFishs,
    getFishId,
    postFish,
    putFish,
    deleteFish
}
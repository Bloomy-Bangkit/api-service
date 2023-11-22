const validator = require('validator')
const bcrypt = require('bcrypt')
const validate = require('../middleware/validation.js')
const userValidation = require('./user-validation.js')
const ResponseError = require('../error/response-error.js')
const User = require('./user-model.js')

const getUser = async request => {
    const email = validate(userValidation.emailValidation, request)
    const isEmail = validator.isEmail(email)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const searchUser = await User.findOne({ where: { email } })
    const user = {
        email: searchUser.dataValues.email,
        username: searchUser.dataValues.username,
        actived: searchUser.dataValues.actived,
        nama: searchUser.dataValues.nama,
        nohp: searchUser.dataValues.nohp,
        alamat: searchUser.dataValues.alamat,
        photo: searchUser.dataValues.photo,
        description: searchUser.dataValues.description,
    }
    return user
}

const updateUser = async(email, request) => {
    const validEmail = validate(userValidation.emailValidation, email)
    const validRequest = validate(userValidation.updateUserValidation, request)
    const isEmail = validator.isEmail(validEmail)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const searchUser = await User.findOne({ where: { email: validEmail } })
    searchUser.nama = validRequest.nama
    searchUser.nohp = validRequest.nohp
    searchUser.alamat = validRequest.alamat
    searchUser.description = validRequest.description
    searchUser.updatedAt = new Date()
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Update user gagal')
    return {
        email: searchUser.email,
        username: searchUser.username,
        actived: searchUser.actived,
        nama: searchUser.nama,
        nohp: searchUser.nohp,
        alamat: searchUser.alamat,
        description: searchUser.description,
    }
}

const updatePassword = async(email, request) => {
    const validEmail = validate(userValidation.emailValidation, email)
    const validRequest = validate(userValidation.updatePasswordValidation, request)
    const isEmail = validator.isEmail(validEmail)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const matchPassword = validRequest.newPassword === validRequest.confirmNewPassword
    if (!matchPassword) throw new ResponseError(400, 'Password salah')
    const searchUser = await User.findOne({ where: { email: validEmail } })
    const checkPasswordUser = await bcrypt.compare(validRequest.oldPassword, searchUser.dataValues.password)
    if (!checkPasswordUser) throw new ResponseError(400, 'Password salah')
    searchUser.password = await bcrypt.hash(validRequest.newPassword, 10)
    searchUser.updatedAt = new Date()
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Update password gagal')
    return {
        email: searchUser.dataValues.email
    }
}

const updatePhoto = async(email, req) => {}

module.exports = {
    getUser,
    updateUser,
    updatePassword,
    updatePhoto
}
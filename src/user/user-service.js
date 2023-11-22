const validator = require('validator')
const bcrypt = require('bcrypt')
const validate = require('../middleware/validation.js')
const userValidation = require('./user-validation.js')
const ResponseError = require('../error/response-error.js')
const User = require('./user-model.js')

const getUsers = async myUsername => {
    const validMyUsername = validate(userValidation.usernameValidation, myUsername)
    const searchUser = await User.findOne({ where: { username: validMyUsername } })
    if (!searchUser) throw new ResponseError(404, 'User anda tidak tersedia')
    const searchAllUser = await User.findAll({
        attributes: ['username', 'actived', 'nama', 'nohp', 'alamat', 'photo', 'description']
    })
    if (searchAllUser.length === 0) throw new ResponseError(404, 'Users tidak ada')
    return searchAllUser
}

const getUser = async(myUsername, username) => {
    const validMyUsername = validate(userValidation.usernameValidation, myUsername)
    const validUsername = validate(userValidation.usernameValidation, username)
    const searchUser = await User.findOne({ where: { username: validMyUsername } })
    if (!searchUser) throw new ResponseError(404, 'User anda tidak tersedia')
    const searchOtherUser = await User.findOne({ where: { username: validUsername } })
    if (!searchOtherUser) throw new ResponseError(404, 'User yang dicari tidak ada')
    return {
        username: searchOtherUser.dataValues.username,
        actived: searchOtherUser.dataValues.actived,
        nama: searchOtherUser.dataValues.nama,
        nohp: searchOtherUser.dataValues.nohp,
        alamat: searchOtherUser.dataValues.alamat,
        photo: searchOtherUser.dataValues.photo,
        description: searchOtherUser.dataValues.description,
    }
}

const getMyUser = async myUsername => {
    const validMyUsername = validate(userValidation.usernameValidation, myUsername)
    const searchUser = await User.findOne({ where: { username: validMyUsername } })
    if (!searchUser) throw new ResponseError(404, 'User anda tidak tersedia')
    return {
        email: searchUser.dataValues.email,
        username: searchUser.dataValues.username,
        actived: searchUser.dataValues.actived,
        nama: searchUser.dataValues.nama,
        nohp: searchUser.dataValues.nohp,
        alamat: searchUser.dataValues.alamat,
        photo: searchUser.dataValues.photo,
        description: searchUser.dataValues.description,
    }
}

const updateUser = async(myUsername, request) => {
    const validMyUsername = validate(userValidation.usernameValidation, myUsername)
    const validRequest = validate(userValidation.updateUserValidation, request)
    const searchUser = await User.findOne({ where: { username: validMyUsername } })
    searchUser.nama = validRequest.nama
    searchUser.nohp = validRequest.nohp
    searchUser.alamat = validRequest.alamat
    searchUser.description = validRequest.description
    searchUser.updatedAt = new Date()
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Update user gagal')
    return {
        username: updatedUser.dataValues.username,
        actived: updatedUser.dataValues.actived,
        nama: updatedUser.dataValues.nama,
        nohp: updatedUser.dataValues.nohp,
        alamat: updatedUser.dataValues.alamat,
        description: updatedUser.dataValues.description,
    }
}

const updatePassword = async(myUsername, request) => {
    const validMyUsername = validate(userValidation.usernameValidation, myUsername)
    const validRequest = validate(userValidation.updatePasswordValidation, request)
    const matchPassword = validRequest.newPassword === validRequest.confirmNewPassword
    if (!matchPassword) throw new ResponseError(400, 'Password salah')
    const searchUser = await User.findOne({ where: { username: validMyUsername } })
    if (!searchUser) throw new ResponseError(400, 'User tidak ditemukan')
    const checkPasswordUser = await bcrypt.compare(validRequest.oldPassword, searchUser.dataValues.password)
    if (!checkPasswordUser) throw new ResponseError(400, 'Password salah')
    searchUser.password = await bcrypt.hash(validRequest.newPassword, 10)
    searchUser.updatedAt = new Date()
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Update password gagal')
    return {
        username: updatedUser.dataValues.username
    }
}

const updatePhoto = async myUsername => {}

module.exports = {
    getUsers,
    getUser,
    getMyUser,
    updateUser,
    updatePassword,
    updatePhoto
}
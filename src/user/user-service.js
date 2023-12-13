const fs = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const { Storage } = require('@google-cloud/storage')
const validate = require('../middleware/validation.js')
const userValidation = require('./user-validation.js')
const ResponseError = require('../error/response-error.js')
const User = require('./user-model.js')
const checkUserAvaiable = require('../utils/check-user-available.js')

const keyFilename = path.join(__dirname, '../../credentials/bangkitcapstone-bloomy-53eae279350a.json')
const GCS = new Storage({ keyFilename })
const bucketName = 'bangkitcapstone-bloomy-bucket'

const getUsers = async myUsername => {
    await checkUserAvaiable(false, myUsername)
    const searchAllUsers = await User.findAll({
        attributes: ['username', 'actived', 'nama', 'nohp', 'alamat', 'provinsi', 'kota', 'photo', 'description']
    })
    if (searchAllUsers.length === 0) throw new ResponseError(404, 'Data users tidak tersedia')
    return searchAllUsers
}

const getUser = async(myUsername, username) => {
    await checkUserAvaiable(false, myUsername)
    const validUsername = validate(userValidation.usernameValidation, username)
    const searchOtherUser = await User.findOne({ where: { username: validUsername } })
    if (!searchOtherUser) throw new ResponseError(404, 'User tidak ditemukan')
    return {
        username: searchOtherUser.dataValues.username,
        actived: searchOtherUser.dataValues.actived,
        nama: searchOtherUser.dataValues.nama,
        nohp: searchOtherUser.dataValues.nohp,
        alamat: searchOtherUser.dataValues.alamat,
        provinsi: searchOtherUser.dataValues.provinsi,
        kota: searchOtherUser.dataValues.kota,
        photo: searchOtherUser.dataValues.photo,
        description: searchOtherUser.dataValues.description,
    }
}

const getMyUser = async myUsername => {
    const searchUser = await checkUserAvaiable(true, myUsername)
    return {
        email: searchUser.dataValues.email,
        username: searchUser.dataValues.username,
        actived: searchUser.dataValues.actived,
        nama: searchUser.dataValues.nama,
        nohp: searchUser.dataValues.nohp,
        alamat: searchUser.dataValues.alamat,
        provinsi: searchUser.dataValues.provinsi,
        kota: searchUser.dataValues.kota,
        photo: searchUser.dataValues.photo,
        description: searchUser.dataValues.description,
    }
}

const updateUser = async(myUsername, request) => {
    const searchUser = await checkUserAvaiable(true, myUsername)
    const validRequest = validate(userValidation.updateUserValidation, request)
    searchUser.nama = validRequest.nama
    searchUser.nohp = validRequest.nohp
    searchUser.alamat = validRequest.alamat
    searchUser.provinsi = validRequest.provinsi
    searchUser.kota = validRequest.kota
    searchUser.description = validRequest.description
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Update user gagal')
    return {
        username: updatedUser.dataValues.username,
        actived: updatedUser.dataValues.actived,
        nama: updatedUser.dataValues.nama,
        nohp: updatedUser.dataValues.nohp,
        alamat: updatedUser.dataValues.alamat,
        provinsi: updatedUser.dataValues.provinsi,
        kota: updatedUser.dataValues.kota,
        description: updatedUser.dataValues.description,
    }
}

const updatePassword = async(myUsername, request) => {
    const searchUser = await checkUserAvaiable(true, myUsername)
    const validRequest = validate(userValidation.updatePasswordValidation, request)
    const matchPassword = validRequest.newPassword === validRequest.confirmNewPassword
    if (!matchPassword) throw new ResponseError(400, 'Password salah')
    const checkPasswordUser = await bcrypt.compare(validRequest.oldPassword, searchUser.dataValues.password)
    if (!checkPasswordUser) throw new ResponseError(400, 'Password salah')
    searchUser.password = await bcrypt.hash(validRequest.newPassword, 10)
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Update password gagal')
    return { username: updatedUser.dataValues.username }
}

const updatePhoto = async(myUsername, filePath) => {
    const fileName = path.basename(filePath)
    const destFileName = `service/user/${fileName}`
    await GCS.bucket(bucketName).upload(filePath, { destination: destFileName, })
    const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`
    const searchUser = await checkUserAvaiable(true, myUsername)
    searchUser.photo = url
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Update photo gagal')
    fs.unlink(filePath)
    return {
        username: updatedUser.dataValues.username,
        photo: updatedUser.dataValues.photo
    }
}

const deleteUsers = async myUsername => {}

const deleteUser = async myUsername => {}

module.exports = {
    getUsers,
    getUser,
    getMyUser,
    updateUser,
    updatePassword,
    updatePhoto,
    deleteUsers,
    deleteUser
}
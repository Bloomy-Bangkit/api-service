const bcrypt = require('bcrypt')
const util = require('util')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const authValidation = require('./auth-validation.js')
const validate = require('../middleware/validation.js')
const ResponseError = require('../error/response-error.js')
const sendEmailVerify = require('../utils/nodemailer.js')
const User = require('../user/user-model.js')

const register = async(req, request) => {
    const validRequest = validate(authValidation.registerValidation, request)
    const matchPassword = validRequest.password === validRequest.confirmPassword ? true : false
    if (!matchPassword) throw new ResponseError(400, 'Password dan Confirm password salah')
    const isEmail = validator.isEmail(validRequest.email)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const checkEmail = await User.count({ where: { email: validRequest.email } })
    if (checkEmail > 0) throw new ResponseError(400, 'Email sudah digunakan')
    const usernameCantUse = ['admin', 'Admin', 'administrator', 'Administrator', 'superadmin', 'SuperAdmin', 'superadministrator', 'SuperAdministrator']
    const checkUsernameCantUser = usernameCantUse.filter(username => username === validRequest.username)
    if (checkUsernameCantUser.length > 0) throw new ResponseError(400, 'Username sudah digunakan')
    const checkUsername = await User.count({ where: { username: validRequest.username } })
    if (checkUsername > 0) throw new ResponseError(400, 'Username sudah digunakan')
    validRequest.password = await bcrypt.hash(validRequest.password, 10)
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const jwtVerifikasiAkun = jwt.sign({ email: validRequest.email, verify: true }, SECRET_KEY, { expiresIn: '3h' })
    const link = `${req.protocol}://${req.get('host')}/auth/verify?token=${jwtVerifikasiAkun}`
    const statusSendEmail = await sendEmailVerify(validRequest.email, link)
    if (!statusSendEmail) throw new ResponseError(400, 'Email verifikasi gagal dikirim')
    const defaultPhoto = 'https://storage.googleapis.com/bangkitcapstone-bloomy-bucket/service/user/profile.jpg'
    const userCreated = await User.create({
        email: validRequest.email,
        username: validRequest.username,
        password: validRequest.password,
        actived: false,
        token: '',
        nama: '',
        nohp: '',
        alamat: '',
        kota: '',
        photo: defaultPhoto,
        description: ''
    })
    if (!userCreated) throw new ResponseError(400, 'Registrasi gagal')
    return {
        email: userCreated.email,
        username: userCreated.username,
        verify: 'Check email untuk verifikasi akun'
    }
}

const login = async request => {
    const validRequest = validate(authValidation.loginValidation, request)
    const isEmail = validator.isEmail(validRequest.email)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const searchUser = await User.findOne({ where: { email: validRequest.email } })
    if (!searchUser) throw new ResponseError(400, 'Email dan Password salah')
    const { username, password, actived } = searchUser.dataValues
    if (!actived) throw new ResponseError(400, 'User belum diverifikasi, silahkan cek email!')
    const matchPassword = await bcrypt.compare(validRequest.password, password)
    if (!matchPassword) throw new ResponseError(400, 'Email dan Password salah')
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '14d' })
    searchUser.token = token
    searchUser.updatedAt = new Date()
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Updated gagal')
    return { token }
}

const verify = async request => {
    const validToken = validate(authValidation.tokenValidation, request)
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const verifyAsync = util.promisify(jwt.verify);
    try {
        const result = await verifyAsync(validToken, SECRET_KEY)
        if (!result.verify) throw new ResponseError(400, 'Gagal verifikasi user')
        const email = result.email
        const searchUser = await User.findOne({ where: { email } })
        if (!searchUser) throw new ResponseError(400, 'User tidak ada')
        searchUser.actived = true
        searchUser.updatedAt = new Date()
        const updatedUser = await searchUser.save()
        if (!updatedUser) throw new ResponseError(400, 'Gagal verifikasi user')
        return true
    } catch (error) {
        throw new ResponseError(400, 'Gagal verifikasi user')
    }
}

const check = async myUsername => {
    const validMyUsername = validate(authValidation.usernameValidation, myUsername)
    const searchUser = await User.findOne({ where: { username: validMyUsername } })
    if (!searchUser) throw new ResponseError(400, 'User tidak ada')
    return true
}

module.exports = {
    login,
    register,
    verify,
    check
}
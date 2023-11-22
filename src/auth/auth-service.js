const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const authValidation = require('./auth-validation.js')
const validate = require('../middleware/validation.js')
const ResponseError = require('../error/response-error.js')
const sendEmailVerify = require('../utils/nodemailer.js')
const verifyToken = require('../utils/verifyToken.js')
const User = require('../user/user-model.js')

const register = async(req, request) => {
    const validateRequest = validate(authValidation.registerValidation, request)
    const matchPassword = validateRequest.password === validateRequest.confirmPassword ? true : false
    if (!matchPassword) throw new ResponseError(400, 'Password salah')
    const isEmail = validator.isEmail(validateRequest.email)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const checkEmail = await User.count({ where: { email: validateRequest.email } })
    if (checkEmail > 0) throw new ResponseError(400, 'Email sudah digunakan')
    const checkUsername = await User.count({ where: { username: validateRequest.username } })
    if (checkUsername > 0) throw new ResponseError(400, 'Username sudah digunakan')
    validateRequest.password = await bcrypt.hash(validateRequest.password, 10)
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const jwtVerifikasiAkun = jwt.sign({ email: validateRequest.email }, SECRET_KEY, { expiresIn: '5m' })
    const link = `${req.protocol}s://${req.get('host')}/auth/verify?token=${jwtVerifikasiAkun}`
    const statusSendEmail = await sendEmailVerify(validateRequest.email, link)
    if (!statusSendEmail) throw new ResponseError(400, 'Email verifikasi gagal dikirim')
    const userCreated = await User.create({
        email: validateRequest.email,
        username: validateRequest.username,
        password: validateRequest.password,
        actived: false,
        token: '',
        nama: '',
        nohp: '',
        alamat: '',
        photo: 'https://storage.googleapis.com/bangkitcapstone-bloomy-bucket/service/default-profile.png',
        description: ''
    })
    if (!userCreated) throw new ResponseError(400, 'Registrasi gagal')
    return {
        email: userCreated.email,
        username: userCreated.username,
        password: userCreated.password,
        message: 'Check email untuk verifikasi akun'
    }
}

const login = async request => {
    const validateRequest = validate(authValidation.loginValidation, request)
    const isEmail = validator.isEmail(validateRequest.email)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const searchUser = await User.findOne({ where: { email: validateRequest.email } })
    if (!searchUser) throw new ResponseError(400, 'Email dan Password salah')
    const { email, password, actived } = searchUser.dataValues
    if (!actived) throw new ResponseError(400, 'User belum diverifikasi, silahkan cek email!')
    const matchPassword = await bcrypt.compare(validateRequest.password, password)
    if (!matchPassword) throw new ResponseError(400, 'Email dan Password salah')
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '3d' })
    searchUser.token = token
    searchUser.updatedAt = new Date()
    const updatedUser = await searchUser.save()
    if (!updatedUser) throw new ResponseError(400, 'Updated gagal')
    return { token }
}

const verify = async request => {
    const validateToken = validate(authValidation.tokenValidation, request)
    const user = await verifyToken(validateToken)
    const email = user.email
    let searchUser = await User.findOne({ where: { email } })
    if (!searchUser) throw new ResponseError(400, 'User tidak ada')
    searchUser.actived = true
    searchUser.updatedAt = new Date()
    const updatedUser = await searchUser.save()
    return {
        email: updatedUser.dataValues.email,
        username: updatedUser.dataValues.username,
        actived: updatedUser.dataValues.actived
    }
}

module.exports = {
    login,
    register,
    verify
}
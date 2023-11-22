const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const authValidation = require('./auth-validation.js')
const validate = require('../middleware/validation.js')
const ResponseError = require('../error/response-error.js')
const sendEmailVerify = require('../utils/nodemailer.js')
const verifyToken = require('../utils/verifyToken.js')
const User = require('./auth-model.js')

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
    console.log({ validateRequest })
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const jwtVerifikasiAkun = jwt.sign({ email: validateRequest.email }, SECRET_KEY, { expiresIn: '5m' })
    console.log({ protocol: req.protocol })
    const link = `${req.protocol}://${req.get('host')}/auth/verify?token=${jwtVerifikasiAkun}`
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
        photo: '',
        description: ''
    }, { attributes: ['email', 'username', 'password'] })
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
    const user = await User.findOne({ where: { email: validateRequest.email } }, { attributes: ['email', 'username', 'password'] })
    if (!user) throw new ResponseError(400, 'Email dan Password salah')
    if (!user.actived) throw new ResponseError(400, 'User belum diverifikasi, silahkan cek email!')
    const matchPassword = await bcrypt.compare(validateRequest.password, user.password)
    if (!matchPassword) throw new ResponseError(400, 'Email dan Password salah')
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '3d' })
    const [numberOfAffectedRows, [updatedUser]] = await User.update({ token }, {
        where: { email: user.email },
        returning: true,
        plain: true,
        attributes: ['token']
    })
    if (numberOfAffectedRows === 0) throw new ResponseError(400, 'Update user gagal')
    return updatedUser
}

const verify = async request => {
    const validateToken = validate(authValidation.tokenValidation, request)
    const user = await verifyToken(validateToken)
    const email = user.email
    const [numberOfAffectedRows, [updatedUser]] = await User.update({ actived: true, updatedAt: new Date() }, {
        where: { email },
        returning: true,
        plain: true,
        attributes: ['email', 'username', 'actived']
    })
    if (numberOfAffectedRows === 0) throw new ResponseError(400, 'Update user gagal')
    return updatedUser
}

module.exports = {
    login,
    register,
    verify
}
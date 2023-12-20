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
    const subject = 'Verifikasi Account Bloomy'
    const text = `Klik link berikut untuk verisikasi akun anda : ${link}`
    const html = `
    <body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; text-align: center; margin: 0; padding: 0;">
        <div class="container"
            style="max-width: 100%; margin: 50px auto; background-color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1>Terima kasih sudah mendaftar di Bloomy🐟</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Klik link berikut untuk
                melakukan verifikasi akun Bloomy anda</p>
            <a href="${link}"
                style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #386FA4; color: #ffffff; font-weight: bold; border-radius: 4px;">Verifikasi
                Akun</a>
        </div>
    </body>`
    const statusSendEmail = await sendEmailVerify(validRequest.email, link, subject, text, html)
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

const verifySend = async(req, email) => {
    const validEmail = validate(authValidation.emailValidation, email)
    const isEmail = validator.isEmail(validEmail)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const searchUser = await User.findOne({ where: { email: validEmail } })
    if (!searchUser) throw new ResponseError(400, 'User tidak ada')
    const accountIsActived = searchUser.actived == 1
    if (accountIsActived) return { status: true, verify: 'Akun sudah aktif' }
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const jwtVerifikasiAkun = jwt.sign({ email: validEmail, verify: true }, SECRET_KEY, { expiresIn: '3h' })
    const link = `${req.protocol}://${req.get('host')}/auth/verify?token=${jwtVerifikasiAkun}`
    const subject = 'Verifikasi Account Bloomy'
    const text = `Klik link berikut untuk verisikasi akun anda : ${link}`
    const html = `
    <body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; text-align: center; margin: 0; padding: 0;">
        <div class="container"
            style="max-width: 100%; margin: 50px auto; background-color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1>Terima kasih sudah mendaftar di Bloomy🐟</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Klik link berikut untuk
                melakukan verifikasi akun Bloomy anda</p>
            <a href="${link}"
                style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #386FA4; color: #ffffff; font-weight: bold; border-radius: 4px;">Verifikasi
                Akun</a>
        </div>
    </body>`
    const statusSendEmail = await sendEmailVerify(validEmail, link, subject, text, html)
    if (!statusSendEmail) throw new ResponseError(400, 'Email verifikasi gagal dikirim')
    return { status: false, verify: 'Check email untuk verifikasi akun' }
}

const verify = async request => {
    const validToken = validate(authValidation.tokenValidation, request)
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const verifyAsync = util.promisify(jwt.verify)
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

const getForgotLink = async(req, email) => {
    const validEmail = validate(authValidation.emailValidation, email)
    const isEmail = validator.isEmail(validEmail)
    if (!isEmail) throw new ResponseError(400, 'Email tidak valid')
    const searchUser = await User.findOne({ where: { email: validEmail } })
    if (!searchUser) throw new ResponseError(400, 'User tidak ada')
    const accountIsActived = searchUser.actived == 1
    if (!accountIsActived) throw new ResponseError(400, 'Akun belum aktif')
    const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
    const jwtVerifikasiAkun = jwt.sign({ email: validEmail, forgot: true }, SECRET_KEY, { expiresIn: '3h' })
    const link = `${req.protocol}://${req.get('host')}/auth/forgot?token=${jwtVerifikasiAkun}`
    const subject = 'Atur Ulang Password'
    const text = `Klik link berikut untuk mengatur ulang password : ${link}`
    const html = `
    <body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; text-align: center; margin: 0; padding: 0;">
        <div class="container"
            style="max-width: 100%; margin: 50px auto; background-color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1>Atur ulang password anda di Platform Bloomy🐟</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Klik link berikut untuk
                melakukan pengaturan password kembali</p>
            <a href="${link}"
                style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #386FA4; color: #ffffff; font-weight: bold; border-radius: 4px;">Ubah Password</a>
        </div>
    </body>`
    const statusSendEmail = await sendEmailVerify(validEmail, link, subject, text, html)
    if (!statusSendEmail) throw new ResponseError(400, 'Email verifikasi gagal dikirim')
    return email
}

const postForgot = async request => {
    const { email, newPassword, confirmNewPassword } = request
    const matchPassword = newPassword === confirmNewPassword
    if (!matchPassword) return false
    const searchUser = await User.findOne({ where: { email: email } })
    if (!searchUser) throw new ResponseError(400, 'User tidak ada')
    searchUser.password = await bcrypt.hash(newPassword, 10)
    const updatePassword = await searchUser.save()
    if (!updatePassword) throw new ResponseError(400, 'Password gagal diperbarui')
    return updatePassword
}

module.exports = {
    login,
    register,
    verifySend,
    verify,
    check,
    getForgotLink,
    postForgot
}
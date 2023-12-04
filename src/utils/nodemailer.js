const { google } = require('googleapis')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

const MY_EMAIL = process.env.MY_EMAIL
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const sendEmailVerify = async(to, link) => {
    const ACCESS_TOKEN = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: MY_EMAIL,
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN,
        },
        tls: {
            rejectUnauthorized: true,
        }
    })
    const mailOptions = {
        from: `Bloomy Admin <${process.env.USER_EMAIL}>`,
        to,
        subject: 'Verifikasi Account Bloomy',
        text: `Klik link berikut untuk verisikasi akun anda : ${link}`,
        html: `<h1>Verification Your Email!😎</h1><br><p>Klik link berikut untuk verisikasi akun anda : ${link}</p>`
    }
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (err, info) => {
            if (err) reject(err)
            resolve(info)
        })
    })
}

module.exports = sendEmailVerify
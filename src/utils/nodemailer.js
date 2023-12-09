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
        html: `
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
    }
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (err, info) => {
            if (err) reject(err)
            resolve(info)
        })
    })
}

module.exports = sendEmailVerify
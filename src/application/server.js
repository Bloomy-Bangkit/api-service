const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
const modelSync = require('../utils/model-sync.js')
const sequelize = require('./sequelize.js')
const User = require('../user/user-model.js')
const Product = require('../product/product-model.js')
const Favorite = require('../favorite/favorite-model.js')
const Transaction = require('../transaction/transaction-model.js')
const Fish = require('../fish/fish-model.js')
const authRoute = require('../auth/auth-route.js')
const userRoute = require('../user/user-route.js')
const productRoute = require('../product/product-route.js')
const favoriteRoute = require('../favorite/favorite-route.js')
const transactionRoute = require('../transaction/transaction-route.js')
const fishRoute = require('../fish/fish-route.js')
const locationRoute = require('../location/location-route.js')
const otherRoute = require('../other/other-route.js')

const app = express()
modelSync(false, [sequelize, User, Product, Favorite, Transaction, Fish])

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true)
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}))

app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT) || 120,
    handler: (req, res) => {
        return res.status(429).json({
            error: true,
            message: 'Terlalu banyak permintaan, silakan coba lagi setelah beberapa saat.'
        })
    }
}))

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/auth', authRoute)
app.use(userRoute)
app.use(productRoute)
app.use(favoriteRoute)
app.use(transactionRoute)
app.use(fishRoute)
app.use('/location', locationRoute)
app.use('/other', otherRoute)

app.get('/', (req, res) => {
    return res.status(200).json({
        Message: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        Data: {
            Project: 'Capstone Bangkit 2023 Batch 2',
            Tema: 'Ocean and Maritime Economy',
            Judul: 'Bloomy',
            Team: 'CH2-PS086',
            Website: 'https://website-bloomy.vercel.app/',
            Anggota: [{
                    BangkitID: 'M128BSY0948',
                    Nama: 'Heical Chandra Syahputra',
                    LearningPath: 'Machine Learning',
                    Universitas: 'Politeknik Negeri Jakarta',
                    Github: 'https://github.com/Dynavx',
                    Linkedin: 'https://www.linkedin.com/in/heical-chandra/'
                },
                {
                    BangkitID: 'M128BSY1852',
                    Nama: 'Andra Rizki Pratama',
                    LearningPath: 'Machine Learning',
                    Universitas: 'Politeknik Negeri Jakarta',
                    Github: 'https://github.com/nulitas',
                    Linkedin: 'https://www.linkedin.com/in/andra-rizki-pratama/'
                },
                {
                    BangkitID: 'M015BSY0866',
                    Nama: 'Novebri Tito Ramadhani',
                    LearningPath: 'Machine Learning',
                    Universitas: 'Universitas Negeri Yogyakarta',
                    Github: 'https://github.com/Benedixx',
                    Linkedin: 'https://www.linkedin.com/in/novebri-tito-ramadhani/'
                },
                {
                    BangkitID: 'C256BSY3481',
                    Nama: 'Aditya Bayu Aji',
                    LearningPath: 'Cloud Computing',
                    Universitas: 'Universitas Muhammadiyah Cirebon',
                    Github: 'https://github.com/iniadittt',
                    Linkedin: 'https://www.linkedin.com/in/iniadittt/'
                },
                {
                    BangkitID: 'C313BSX3054',
                    Nama: 'Asrini Salsabila Putri',
                    LearningPath: 'Cloud Computing',
                    Universitas: 'Universitas Siliwangi',
                    Github: 'https://github.com/asrinisp',
                    Linkedin: 'https://www.linkedin.com/in/asrinisalsabilaputri/'
                },
                {
                    BangkitID: 'A258BSY2276',
                    Nama: 'Ahmad Tiova Ian Avola',
                    LearningPath: 'Mobile Development',
                    Universitas: 'Universitas Muhammadiyah Malang',
                    Github: 'https://github.com/VBeatDead',
                    Linkedin: 'https://www.linkedin.com/in/tiova/'
                },
                {
                    BangkitID: 'A128BSY2319',
                    Nama: 'Sandhi Karunia Sugihartana',
                    LearningPath: 'Mobile Development',
                    Universitas: 'Politeknik Negeri Jakarta',
                    Github: 'https://github.com/Lowl16',
                    Linkedin: 'https://www.linkedin.com/in/sandhi-karunia-sugihartana/'
                },
            ],
            Moto: 'Cihhh! Jangan meremehkan wibuuu, dasar Ninggen tidak bergunaa! >.< iKuzooo minnaa..',
            CreatedBy: 'Aditya Bayu',
            Copyright: '©2023 All Rights Reserved!'
        }
    })
})

app.all('*', async(req, res) => {
    return res.redirect('/')
})

module.exports = app
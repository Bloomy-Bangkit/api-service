const express = require('express')
const bodyParser = require('body-parser');
const modelSync = require('../utils/model-sync.js')
const sequelize = require('./sequelize.js')
const User = require('../user/user-model.js')
const Product = require('../product/product-model.js')
const Favorite = require('../favorite/favorite-model.js')
const Transaction = require('../transaction/transaction-model.js')
const authRoute = require('../auth/auth-route.js')
const userRoute = require('../user/user-route.js')
const productRoute = require('../product/product-route.js')
const favoriteRoute = require('../favorite/favorite-route.js')
const transactionRoute = require('../transaction/transaction-route.js')

modelSync(false, [sequelize, User, Product, Favorite, Transaction])

const app = express()
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth', authRoute)
app.use(userRoute)
app.use(productRoute)
app.use(favoriteRoute)
app.use(transactionRoute)

app.get('/', (req, res) => {
    return res.status(200).json({
        Message: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        Data: {
            Project: 'Capstone Bangkit 2023 Batch 2',
            Tema: 'Ocean and Maritime Economy',
            Judul: 'Bloomy',
            Team: 'CH2-PS086',
            Anggota: [
                { BangkitID: 'M128BSY0948', Nama: 'Heical Chandra Syahputra', Universitas: 'Politeknik Negeri Jakarta' },
                { BangkitID: 'M128BSY1852', Nama: 'Andra Rizki Pratama', Universitas: 'Politeknik Negeri Jakarta' },
                { BangkitID: 'M015BSY0866', Nama: 'Novebri Tito Ramadhani', Universitas: 'Universitas Negeri Yogyakarta' },
                { BangkitID: 'C256BSY3481', Nama: 'Aditya Bayu Aji', Universitas: 'Universitas Muhammadiyah Cirebon' },
                { BangkitID: 'C313BSX3054', Nama: 'Asrini Salsabila Putri', Universitas: 'Universitas Siliwangi' },
                { BangkitID: 'A258BSY2276', Nama: 'Ahmad Tiova Ian Avola', Universitas: 'Universitas Muhammadiyah Malang' },
                { BangkitID: 'A128BSY2319', Nama: 'Sandhi Karunia Sugihartana', Universitas: 'Politeknik Negeri Jakarta' },
            ],
            Moto: 'Cihhh! Jangan meremehkan wibuuu, dasar Ninggen tidak bergunaa! >.< iKuzooo minnaa..',
            CreatedBy: 'Aditya Bayu',
            Copyright: '©2023 All Rights Reserved!'
        },
        env: {
            DB_NAME: process.env.DB_NAME,
            DB_PORT: process.env.DB_PORT,
            DB_USER: process.env.DB_USER,
            DB_PASS: process.env.DB_PASS,
            DB_HOST: process.env.DB_HOST,
        }
    })
})

app.all('*', async(req, res) => {
    return res.redirect('/')
})

module.exports = app
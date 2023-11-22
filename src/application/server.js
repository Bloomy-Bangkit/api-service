const express = require('express')
const sequelize = require('./sequelize.js')
const User = require('../user/user-model.js')
const Product = require('../product/product-model.js')
const modelSync = require('../utils/modelSync.js')
const authRoute = require('../auth/auth-route.js')
const userRoute = require('../user/user-route.js')
const productRoute = require('../product/product-route.js')

const app = express()

modelSync([sequelize, User, Product], false)

app.use(express.json())
app.use('/auth', authRoute)
app.use(userRoute)
app.use(productRoute)

app.get('/', (req, res) => res.status(200).json({ message: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' }))

module.exports = app
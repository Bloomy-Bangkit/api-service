const express = require('express')
const sequelize = require('./sequelize.js')
const authRoute = require('../auth/auth-route.js')
const userRoute = require('../user/user-route.js')
const productRoute = require('../product/product-route.js')

const app = express()

sequelize
    .sync({ force: false })
    .then(() => console.log('Models synchronized with the Database!'))
    .catch(error => console.error(`ERROR synchronizing Models, message: ${error}`))

app.use(express.json())
app.use('/auth', authRoute)
app.use(userRoute)
app.use(productRoute)

app.get('/', (req, res) => res.status(200).json({ message: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' }))

module.exports = app
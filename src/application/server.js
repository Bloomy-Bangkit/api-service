const express = require('express')
const authRoute = require('../auth/auth-route.js')
const userRoute = require('../user/user-route.js')

const app = express()

app.use(express.json())
app.use('/auth', authRoute)
app.use('/user', userRoute)

app.get('/', (req, res) => res.status(200).json({ message: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' }))

module.exports = app
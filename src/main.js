import dotenv from 'dotenv'
import express from 'express'
import connection from './application/connection.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

connection()

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/database', (req, res) => res.send(connection()))

app.listen(PORT, () => {
    console.log(`App is running at: http://localhost:${PORT}`)
})
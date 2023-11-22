const dotenv = require('dotenv')
const app = require('./application/server.js')
const logger = require('./application/logging.js')
const connection = require('./application/connection.js')

dotenv.config()

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    logger.info(`App is running at port: ${PORT}`)
    connection()
})
const database = require('./database.js')
const logger = require('./logging.js')

const connection = async() => {
    try {
        database.authenticate
        logger.info('Database terhubung')
    } catch (error) {
        logger.error(`Database gagal terhubung, error: ${error.message}`)
    }
}

module.exports = connection
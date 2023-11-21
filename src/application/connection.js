import database from './database.js'

const connection = async() => {
    try {
        database.authenticate
        console.log('Database terhubung')
    } catch (error) {
        console.log(`Database gagal terhubung, error: ${error.message}`)
    }
}

export default connection
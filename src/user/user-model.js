const { Sequelize, DataTypes } = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const DB_NAME = process.env.DB_NAME

const sequelize = new Sequelize(`mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:3306/${DB_NAME}`)

const User = sequelize.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    token: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    nama: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    nohp: {
        type: DataTypes.STRING(16),
        defaultValue: '',
    },
    alamat: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    photo: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
}, { sequelize, modelName: 'user' })

sequelize.sync({ force: false })
    .then(() => console.log('User models synchronized with the Database!'))
    .catch(error => console.error(`ERROR synchronizing User models: ${error}`))

module.exports = User
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')

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
    kota: {
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
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, { sequelize, modelName: 'user' })

module.exports = User
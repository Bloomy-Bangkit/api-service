const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')

const Fish = sequelize.define('fish', {
    idFish: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    nama: {
        type: DataTypes.STRING,
        required: true,
    },
    price: {
        type: DataTypes.INTEGER,
        required: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, { sequelize, modelName: 'fish' })

module.exports = Fish
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')

const Favorite = sequelize.define('favorite', {
    idFavorite: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    idProduct: {
        type: DataTypes.STRING,
        references: {
            model: 'products',
            key: 'idProduct',
        },
    },
    usernameBuyer: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'username',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, { sequelize, modelName: 'favorite' })

module.exports = Favorite
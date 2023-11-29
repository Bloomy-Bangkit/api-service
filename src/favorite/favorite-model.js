const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')
const User = require('../user/user-model.js')
const Product = require('../product/product-model.js')

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

Favorite.belongsTo(User, {
    foreignKey: 'usernameBuyer',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Favorite.belongsTo(Product, {
    foreignKey: 'idProduct',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

module.exports = Favorite
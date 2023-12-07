const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')
const User = require('../user/user-model.js')
const Favorite = require('../favorite/favorite-model.js')
const Transaction = require('../transaction/transaction-model.js')

const Product = sequelize.define('product', {
    idProduct: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
    },
    usernameSeller: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'username',
        },
    },
    picture: {
        type: DataTypes.STRING,
    },
    nama: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    grade: {
        type: DataTypes.STRING(1),
    },
    price: {
        type: DataTypes.INTEGER,
    },
    weight: {
        type: DataTypes.INTEGER,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, { sequelize, modelName: 'product' })

Transaction.belongsTo(Product, {
    foreignKey: 'idProduct',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Favorite.belongsTo(Product, {
    foreignKey: 'idProduct',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Product.hasMany(Favorite, { foreignKey: 'idProduct' })
Product.hasMany(Transaction, { foreignKey: 'idProduct' })

module.exports = Product
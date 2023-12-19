const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')
const Product = require('../product/product-model.js')
const User = require('../user/user-model.js')

const Transaction = sequelize.define('transaction', {
    idTransaction: {
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
    weight: {
        type: DataTypes.INTEGER,
    },
    price: {
        type: DataTypes.INTEGER,
    },
    type: {
        type: DataTypes.STRING(1),
    },
    status: {
        type: DataTypes.STRING(1),
        defaultValue: "0",
    },
    noResi: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true
    },
    ongkir: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    datePickup: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, { sequelize, modelName: 'transaction' })

module.exports = Transaction
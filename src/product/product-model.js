const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')
const User = require('../user/user-model.js')

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
        unique: true,
    },
    nama: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    grade: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.INTEGER,
    },
    weight: {
        type: DataTypes.INTEGER,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    }
}, { sequelize, modelName: 'product' })

Product.belongsTo(User, {
    foreignKey: 'usernameSeller',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

module.exports = Product
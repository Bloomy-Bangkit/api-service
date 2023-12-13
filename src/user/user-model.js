const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../application/sequelize.js')
const Product = require('../product/product-model.js')
const Favorite = require('../favorite/favorite-model.js')
const Transaction = require('../transaction/transaction-model.js')

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
    provinsi: {
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


Product.belongsTo(User, {
    foreignKey: 'usernameSeller',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Transaction.belongsTo(User, {
    foreignKey: 'usernameBuyer',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Favorite.belongsTo(User, {
    foreignKey: 'usernameBuyer',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

User.hasMany(Product, { foreignKey: 'usernameSeller' })
User.hasMany(Favorite, { foreignKey: 'usernameBuyer' })
User.hasMany(Transaction, { foreignKey: 'usernameBuyer' })

module.exports = User
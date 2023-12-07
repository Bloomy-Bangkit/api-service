'use strict'

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('transactions', {
            idTransaction: {
                type: Sequelize.STRING,
                primaryKey: true,
                unique: true,
            },
            idProduct: {
                type: Sequelize.STRING,
                references: {
                    model: 'products',
                    key: 'idProduct',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            usernameBuyer: {
                type: Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'username',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL', // or 'CASCADE' or 'SET NULL' depending on your requirements
            },
            weight: {
                type: Sequelize.INTEGER,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            type: {
                type: Sequelize.STRING(1),
            },
            status: {
                type: Sequelize.STRING(1),
                defaultValue: "0",
            },
            noResi: {
                type: Sequelize.STRING,
                defaultValue: "",
            },
            ongkir: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            datePickup: {
                type: Sequelize.DATE,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        })
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('transactions')
    }
}
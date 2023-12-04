'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('transaction', {
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
            },
            usernameBuyer: {
                type: Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'username',
                },
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
            }
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            }
        })
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('transaction')
    }
};
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('user', {
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            username: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            actived: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            token: {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            nama: {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            nohp: {
                type: Sequelize.STRING(16),
                defaultValue: '',
            },
            alamat: {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            photo: {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            description: {
                type: Sequelize.STRING,
                defaultValue: '',
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
        await queryInterface.dropTable('user')
    }
}
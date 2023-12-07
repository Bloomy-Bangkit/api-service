'use strict'

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('favorites', {
            idFavorite: {
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
        await queryInterface.dropTable('favorites')
    }
}
'use strict'

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('products', {
            idProduct: {
                type: Sequelize.STRING,
                primaryKey: true,
                unique: true,
            },
            usernameSeller: {
                type: Sequelize.STRING,
                references: {
                    model: 'users',
                    key: 'username',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL', // or 'CASCADE' or 'SET NULL' depending on your requirements
            },
            picture: {
                type: Sequelize.STRING,
            },
            nama: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
                defaultValue: '',
            },
            grade: {
                type: Sequelize.STRING(1),
            },
            price: {
                type: Sequelize.INTEGER,
            },
            weight: {
                type: Sequelize.INTEGER,
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

        // Add foreign key for Favorite
        await queryInterface.addColumn('favorites', 'idProduct', {
            type: Sequelize.STRING,
            references: {
                model: 'products',
                key: 'idProduct',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })

        // Add foreign key for Transaction
        await queryInterface.addColumn('transactions', 'idProduct', {
            type: Sequelize.STRING,
            references: {
                model: 'products',
                key: 'idProduct',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })
    },

    down: async(queryInterface, Sequelize) => {
        // Remove foreign key from Favorite
        await queryInterface.removeColumn('favorites', 'idProduct')

        // Remove foreign key from Transaction
        await queryInterface.removeColumn('transactions', 'idProduct')

        // Drop the products table
        await queryInterface.dropTable('products')
    }
}
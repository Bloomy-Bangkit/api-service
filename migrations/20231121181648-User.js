'use strict'

module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('users', {
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true,
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
            kota: {
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
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        })

        // Add foreign key for Product
        await queryInterface.addColumn('products', 'usernameSeller', {
            type: Sequelize.STRING,
            references: {
                model: 'users',
                key: 'username',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })

        // Add foreign key for Transaction
        await queryInterface.addColumn('transactions', 'usernameBuyer', {
            type: Sequelize.STRING,
            references: {
                model: 'users',
                key: 'username',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })

        // Add foreign key for Favorite
        await queryInterface.addColumn('favorites', 'usernameBuyer', {
            type: Sequelize.STRING,
            references: {
                model: 'users',
                key: 'username',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })
    },

    down: async(queryInterface, Sequelize) => {
        // Remove foreign key from Product
        await queryInterface.removeColumn('products', 'usernameSeller')

        // Remove foreign key from Transaction
        await queryInterface.removeColumn('transactions', 'usernameBuyer')

        // Remove foreign key from Favorite
        await queryInterface.removeColumn('favorites', 'usernameBuyer')

        // Drop the users table
        await queryInterface.dropTable('users')
    }
}
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('product', {
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
            },
            picture: {
                type: Sequelize.STRING,
                unique: true,
            },
            nama: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
                defaultValue: "",
            },
            grade: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            weight: {
                type: Sequelize.INTEGER,
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

        await queryInterface.addConstraint('product', {
            fields: ['usernameSeller'],
            type: 'foreign key',
            name: 'fk_usernameSeller',
            references: {
                table: 'users',
                field: 'username',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('product')
    }
}
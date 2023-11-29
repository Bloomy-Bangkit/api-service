'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable('favorite', {
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
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            }
        })

        await queryInterface.addConstraint('products', {
            fields: ['idProduct'],
            type: 'foreign key',
            name: 'fk_idProduct',
            references: {
                table: 'products',
                field: 'idProduct',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })

        await queryInterface.addConstraint('users', {
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
        await queryInterface.dropTable('favorite')
    }
};
module.exports = (sequelize, Sequelize) => {
    const Save = sequelize.define('saves', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users', // Replace with your user model name
                key: 'id'
            }
        },
        roomId: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'rooms', // Replace with your room model name
                key: 'id'
            }
        },
        eventId: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'events', // Replace with your event model name
                key: 'id'
            }
        },
        roommateId: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
            references: {
                model: 'roommates', // Replace with your roommate model name
                key: 'id'
            }
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE,
            allowNull: false,
        },
    }, {
        tableName: 'saves',
    });

    return Save;
}

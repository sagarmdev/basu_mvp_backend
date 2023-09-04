module.exports = (sequelize, Sequelize) => {

    const Room = sequelize.define('rooms', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        title: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        description: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        roomType: {
            type: Sequelize.BIGINT.UNSIGNED,
            references: {
                model: 'roomTypes',
                key: 'id'
            }
        },
        bedRooms: {
            type: Sequelize.INTEGER(50),
            // defaultValue: 1,
        },
        bathRooms: {
            type: Sequelize.INTEGER(50),
            // defaultValue: 1,
        },
        tenant: {
            type: Sequelize.INTEGER(50),
            allowNull: true,
            // defaultValue: 1,
        },
        liveWith: {
            type: Sequelize.STRING,
            enum: ['Other', 'Male', 'Female'],
            allowNull: false
        },
        prefereOccupation: {
            type: Sequelize.STRING,
            enum: ['Student', 'Employee', 'Worker'],
            allowNull: false
        },
        availibility: {
            type: Sequelize.DATE,
        },
        monthlyRent: {
            type: Sequelize.INTEGER,
            allowNull: true,
            default: null
        },
        minimumStay: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        roomSize: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        extraBills: {
            type: Sequelize.STRING,
            enum: ['Included'],
            allowNull: false
        },
        city: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        lat: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        lng: {
            type: Sequelize.STRING(500),
            allowNull: true,
        },
        active: {
            type: Sequelize.INTEGER(2),
            allowNull: false,
            defaultValue: 1,
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
        deletedAt: {
            field: 'deleted_at',
            type: Sequelize.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'rooms',
        paranoid: "true"
    });

    return Room
}

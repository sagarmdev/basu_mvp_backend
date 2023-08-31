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
        // mediaUrl: {
        //     type: Sequelize.STRING(500),
        //     allowNull: true,
        // },
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
            type: Sequelize.INTEGER(3), //1=both 2=male 3=female  
        },
        houseRule: {
            type: Sequelize.BIGINT.UNSIGNED,
            references: {
                model: 'houseRules',
                key: 'id'
            }
        },
        prefereOccupation: {
            type: Sequelize.INTEGER(3), //1=student 2=employee 3=worker  
        },
        availibility: {
            type: Sequelize.DATE,
        },
        monthlyRent: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        minimumStay: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        roomSize: {
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        extraBills: {
            type: Sequelize.BOOLEAN,
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

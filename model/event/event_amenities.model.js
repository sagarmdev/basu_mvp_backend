module.exports = (sequelize, Sequelize) => {
    const eventAmenities = sequelize.define('event_amenities', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
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
        tableName: 'event_amenities',
        paranoid: "true"
    });
    return eventAmenities
}
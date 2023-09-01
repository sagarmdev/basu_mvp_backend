module.exports = (sequelize, Sequelize) => {
    const roommateMedial = sequelize.define('roommate_medias', {
        id: {
            type: Sequelize.BIGINT.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        // media_type: {
        //     type: Sequelize.INTEGER,
        //     enum: [1, 2], //1 = photo , 2 = video
        // },
        roommate_id: {
            type: Sequelize.BIGINT.UNSIGNED,
            references: {
                model: "roommates",
                key: 'id'
            }
        },
        media: {
            type: Sequelize.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('media');
                return rawValue ? ASSETS.getMediaUrl(rawValue, "roommate_media") : null;
            }
        },
        // video: {
        //     type: Sequelize.TEXT,
        //     allowNull: true,
        //     // get() {
        //     //     const rawValue = this.getDataValue('video');
        //     //     return rawValue ? ASSETS.getProfileUrl(rawValue) : null;
        //     // }
        // },
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
        tableName: 'roommate_medias',
        paranoid: "true"
    });
    return roommateMedial
}
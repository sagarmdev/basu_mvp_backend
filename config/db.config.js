const config = require('./config')
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database.database, config.database.username, config.database.password, {
    host: config.database.host,
    dialect: process.env.DB_DIALECT,
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --------------------------------- Models/Table --------------------------------------------//

// api logs 
db.api_logs = require('../model/api_logs.model')(sequelize, Sequelize)
db.users = require('../model/user.model')(sequelize, Sequelize)
db.user_sessions = require('../model/userSession.model')(sequelize, Sequelize)
db.houseAmenities = require('../model/room/amenities.model')(sequelize, Sequelize)
db.room_amenities = require('../model/room/roomAmenities.model')(sequelize, Sequelize)
db.media = require('../model/media.model')(sequelize, Sequelize)
db.room_rules = require('../model/room/roomRules.model')(sequelize, Sequelize)
db.roomsType = require('../model/room/roomType.model')(sequelize, Sequelize)
db.houseRules = require('../model/room/rules.model')(sequelize, Sequelize)
db.rooms = require('../model/room/room.model')(sequelize, Sequelize)
db.media = require('../model/media.model')(sequelize, Sequelize)



// db.rooms.hasMany(db.room_amenities, { foreignKey: 'amenitieId' });
// db.room_amenities.belongsTo(db.rooms, { foreignKey: 'amenitieId' });



db.sequelize.sync({ force: false });

module.exports = db;

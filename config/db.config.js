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


//...............event models
db.event_categories = require('../model/event/event_categories.model')(sequelize, Sequelize)
db.event_amenities = require('../model/event/event_amenities.model')(sequelize, Sequelize);
db.event = require('../model/event/event.model')(sequelize, Sequelize);
db.event_photos = require('../model/event/event_photo.model')(sequelize, Sequelize);
db.selected_amenities = require('../model/event/selected_event_amenities.model')(sequelize, Sequelize)

//.................items model..........
db.items_categories = require('../model/item/item_categories.model')(sequelize, Sequelize);
db.items = require('../model/item/item.model')(sequelize, Sequelize)
db.item_photos = require('../model/item/item_photo.model')(sequelize, Sequelize);

//...............roommate model....
db.roommate_interests = require('../model/roommate/roommate_interests.model')(sequelize, Sequelize);
db.roommate_socials = require('../model/roommate/roommate_social.model')(sequelize, Sequelize);
db.roommate = require('../model/roommate/roommate.model')(sequelize, Sequelize);
db.roommate_media = require('../model/roommate/roommate_media.model')(sequelize, Sequelize)
db.selectedInterest = require('../model/roommate/selected_interest.model')(sequelize, Sequelize);
db.selectedSocials = require('../model/roommate/selected_social.model')(sequelize, Sequelize);
db.lifestyle = require('../model/roommate/lifestyle.model')(sequelize, Sequelize);
db.selectedLifestyle = require('../model/roommate/selected_lifestyle.model')(sequelize, Sequelize);

//..........................relation...............

// db.rooms.hasMany(db.room_amenities, { foreignKey: 'amenitieId' });
// db.room_amenities.belongsTo(db.rooms, { foreignKey: 'amenitieId' });


//event 
db.event.hasMany(db.event_photos, { foreignKey: 'event_id' });
db.event_photos.belongsTo(db.event, { foreignKey: 'event_id' });

db.event_categories.hasMany(db.event, { foreignKey: 'category_id' });
db.event.belongsTo(db.event_categories, { foreignKey: 'category_id' });

db.event.hasMany(db.selected_amenities, { foreignKey: 'event_id' });
db.selected_amenities.belongsTo(db.event, { foreignKey: 'event_id' });

db.event_amenities.hasMany(db.selected_amenities, { foreignKey: 'event_amenities_id' });
db.selected_amenities.belongsTo(db.event_amenities, { foreignKey: 'event_amenities_id' });


//item
db.items_categories.hasMany(db.items, { foreignKey: 'item_category_id' });
db.items.belongsTo(db.items_categories, { foreignKey: 'item_category_id' })

db.items.hasMany(db.item_photos, { foreignKey: 'items_id' });
db.item_photos.belongsTo(db.items, { foreignKey: 'items_id' });


// //roommate
db.roommate.hasMany(db.roommate_media, { foreignKey: 'roommate_id' });
db.roommate_media.belongsTo(db.roommate, { foreignKey: 'roommate_id' })


db.roommate.hasMany(db.selectedInterest, { foreignKey: 'roommate_id' });
db.selectedInterest.belongsTo(db.roommate, { foreignKey: 'roommate_id' });

db.roommate.hasMany(db.selectedSocials, { foreignKey: 'roommate_id' });
db.selectedSocials.belongsTo(db.roommate, { foreignKey: 'roommate_id' });

db.roommate.hasMany(db.selectedLifestyle, { foreignKey: 'roommate_id' });
db.selectedLifestyle.belongsTo(db.roommate, { foreignKey: 'roommate_id' })

db.roommate_interests.hasMany(db.selectedInterest, { foreignKey: 'interest_id' });
db.selectedInterest.belongsTo(db.roommate_interests, { foreignKey: 'interest_id' });

db.roommate_socials.hasMany(db.selectedSocials, { foreignKey: 'social_id' });
db.selectedSocials.belongsTo(db.roommate_socials, { foreignKey: 'social_id' });


db.lifestyle.hasMany(db.selectedLifestyle, { foreignKey: 'lifestyle_id' });
db.selectedLifestyle.belongsTo(db.lifestyle, { foreignKey: 'lifestyle_id' })



db.sequelize.sync({ force: false });

module.exports = db;

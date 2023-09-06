const Validator = require('validatorjs');
const db = require("../config/db.config");
// const db = require('../models'); 
const Save = db.saves;
const Room = db.rooms;
const Event = db.event;
const Roommate = db.roommate;
const RoomAmenitie = db.room_amenities;
const Media = db.media;
const RoomRules = db.room_rules;
const Houserules = db.houseRules;
const Houseamenities = db.houseAmenities;
// const { Sequelize, Op } = require('sequelize');

const savePost = async (req, res) => {
    try {
        const { user: { id }, body: { roomId, eventId, roommateId } } = req;
        const post = await Save.create({ userId: id, roomId, eventId, roommateId })
        return RESPONSE.success(res, 1201, post);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
};


const getSavePost = async (req, res) => {
    try {
        const { user: { id } } = req;
        const post = await Save.findAll({
            where: { user_id: id },
            include: [
                {
                    model: Room,
                    as: 'room',
                    include: [
                        {
                            model: Media,
                            as: 'media',
                        },
                        {
                            model: RoomAmenitie,
                            as: 'roomAmenities',
                            include: [
                                {
                                    model: Houseamenities,
                                    as: 'houseamenitie'
                                }
                            ]
                        },
                        {
                            model: RoomRules,
                            as: 'roomRules',
                            include: [
                                {
                                    model: Houserules,
                                    as: 'houserules'
                                }
                            ]
                        },
                    ]
                },
                {
                    model: Event,
                    as: 'event',
                },
                {
                    model: Roommate,
                    as: 'roommate',
                }
            ],
        })
        // console.log(req.user.id);
        // console.log(post);
        return RESPONSE.success(res, 1202, post);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
};


module.exports = { savePost, getSavePost }

const Validator = require("validatorjs");
const db = require('../config/db.config');
const { UploadFiles } = require('../helpers/file')
const { Op } = require('sequelize')


//...................models............
const Event_categories = db.event_categories;
const Event_amenities = db.event_amenities;
const Event = db.event;
const Event_photos = db.event_photos;
const Event_booking = db.event_booking;
const Selected_amenities = db.selected_amenities;



//.......................get All event_categories.....
const getAllEventCategories = async (req, res) => {
    try {
        const authUser = req.user;

        const eventCategories = await Event_categories.findAll();

        if (!eventCategories) {
            return RESPONSE.error(res, 2002);
        }

        return RESPONSE.success(res, 2001, eventCategories);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


//.......................get All event_categories.....
const getAllEventAmenities = async (req, res) => {
    try {
        const authUser = req.user;

        const eventAmenities = await Event_amenities.findAll();

        if (!eventAmenities) {
            return RESPONSE.error(res, 2004);
        }

        return RESPONSE.success(res, 2003, eventAmenities);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


//.....................create event......................
const createEvent = async (req, res) => {
    let validation = new Validator(req.body, {
        event_title: 'required|string',
        event_details: 'required|string',
        seats: 'required|numeric',
        date: 'required',
        time: 'required',
        price: 'required',
        city: 'required|string',
        lat: 'required',
        long: 'required',
        event_amenities_id: 'required|array',
        category_id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const authUser = req.user.id;

        const { event_title, event_details, seats, date, time, price, city, lat, long, category_id, event_amenities_id } = req.body;

        const event = await Event.create({ user_id: authUser, event_title, event_details, seats, date, time, price, city, lat, long, category_id });

        if (event) {

            for (selectedData of event_amenities_id) {

                await Selected_amenities.create({
                    event_amenities_id: selectedData,
                    event_id: event.id
                });
            }

            let photos = [];
            if (typeof req.files !== 'undefined' && req.files.length > 0) {
                photos = await UploadFiles(req.files, 'images/event_images', 'image');
            }
            for (const image of photos) {
                await Event_photos.create({
                    event_id: event.id,
                    photo: image
                })
            }

        }

        const findEvent = await Event.findOne({
            where: { id: event.id },
            include: [
                {
                    model: Event_photos,
                    attributes: ['photo', 'id']
                },
                {
                    model: Event_categories,
                    attributes: ['name', 'id']
                },
                {
                    model: Selected_amenities,
                    attributes: ['event_amenities_id', 'id'],
                    include: [
                        {
                            model: Event_amenities,
                            attributes: ['name', 'id']
                        }
                    ]
                }
            ],
        });


        return RESPONSE.success(res, 2005, findEvent);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


//....................event booking ...........................
const eventBooking = async (req, res) => {
    let validation = new Validator(req.body, {
        event_id: 'required',
        participants: 'required|numeric|min:1',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    let trans = await db.sequelize.transaction();
    try {
        const { event_id, participants } = req.body;
        const authUser = req.user;

        const isExist = await Event_booking.findAll({
            where: {
                user_id: authUser.id,
                event_id: event_id,
                status: {
                    [Op.or]: ['Pending', 'Accept']
                }
            }
        });


        if (isExist.length) {
            return RESPONSE.error(res, 2107)
        }

        const findEvent = await Event.findOne({ where: { id: event_id } });

        if (!findEvent) {
            await trans.rollback();
            return RESPONSE.error(res, 1105);
        }

        if (Number(participants) > Number(findEvent.seats)) {
            await trans.rollback();
            return RESPONSE.error(res, 2007);
        }

        const eventBooking = await Event_booking.create({ user_id: authUser.id, event_id: findEvent.id, participants }, { transaction: trans });

        await trans.commit();
        return RESPONSE.success(res, 2006, eventBooking);
    } catch (error) {
        await trans.rollback();
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}

//get your all events

const getEvent = async (req, res) => {
    try {
        const { user: { id } } = req;
        const event = await Event.findAll({
            where: { user_id: id },
            include: [
                {
                    model: Event_photos,
                    attributes: ['photo', 'id']
                },
                {
                    model: Event_categories,
                    attributes: ['name', 'id']
                },
                {
                    model: Selected_amenities,
                    attributes: ['event_amenities_id', 'id'],
                    include: [
                        {
                            model: Event_amenities,
                            attributes: ['name', 'id']
                        }
                    ]
                }
            ],
        });
        return RESPONSE.success(res, 2008, event);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
};



module.exports = {
    getAllEventCategories,
    getAllEventAmenities,
    createEvent,
    eventBooking,
    eventBooking,
    getEvent
}


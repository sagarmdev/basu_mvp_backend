const Validator = require("validatorjs");
const db = require('../config/db.config');
const { UploadFiles } = require('../helpers/file')


//...................models............
const Event_categories = db.event_categories;
const Event_amenities = db.event_amenities;
const Event = db.event;
const Event_photos = db.event_photos;
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
        const authUser = req.user;

        const { event_title, event_details, date, time, price, city, lat, long, category_id, event_amenities_id } = req.body;

        const event = await Event.create({ event_title, event_details, date, time, price, city, lat, long, category_id });

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



module.exports = {
    getAllEventCategories,
    getAllEventAmenities,
    createEvent
}
const Validator = require("validatorjs");
const db = require('../config/db.config');
const { Op } = require('sequelize')
const randomstring = require('randomstring')


//...................models............
const Roommate = db.roommate;
const Roommate_media = db.roommate_media;
const Roommate_social = db.roommate_socials;
const Roommate_interests = db.roommate_interests;

const Lifestyle = db.lifestyle
const SelectedSocial = db.selectedSocials
const SelectedInterest = db.selectedInterest
const SelectedLifestyle = db.selectedLifestyle;

const Roommate_booking = db.roommate_booking;
const { uploadRoommateFiles, UploadFiles } = require('../helpers/file')


//...............add roommate...............
const addRoommate = async (req, res) => {
    let validation = new Validator(req.body, {
        city: 'required|string',
        lat: 'required',
        long: 'required',
        gender: 'required|in:Male,Female,Other',
        age: 'required|numeric',
        Occupation: 'required|string',
        food_choice: 'required|in:Vegetarian,Non-Vegetarian',
        religion: 'required|in:Hindu,Muslim,Christianity,Buddhism,Other',
        monthly_rent: 'required|numeric',
        minimum_stay: 'required|numeric',
        bathrooms: 'required|numeric',
        bedrooms: 'required|numeric',
        no_of_roommates: 'required|numeric',
        required_roommate: 'required|numeric',
        marital_status: 'required|in:Single,Married',
        gender_preference: 'required|in:Male,Female,Other',
        preference_food_choice: 'required|in:Vegetarian,Non-Vegetarian',
        preference_age: 'required|in:12-18 Year,18-35 Year,35-50 Year',
        lifestyle: 'required|in:Pet Friendly,Non-smoker',
        message: 'required|string',
        interest_id: 'required|array',
        social_id: 'required|array',
        lifestyle_id: 'required|array',

    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }

    try {
        const { city, lat, long, gender, age, Occupation, food_choice, religion, monthly_rent, minimum_stay, bathrooms, bedrooms, no_of_roommates, required_roommate, marital_status, gender_preference, preference_food_choice, preference_age, lifestyle, interest_id, social_id, lifestyle_id, message } = req.body;

        const authUser = req.user.id

        let photo = [];
        if (typeof req.files !== 'undefined' && req.files.length > 0) {

            const data = req.files.filter((item) => item.fieldname == "image")
            if (data.length != 1) {
                return RESPONSE.error(res, 2202)
            }
            photo = await UploadFiles(data, 'images/roommate_media', 'image');
        }

        const addRoommate = await Roommate.create({ user_id: authUser, image: photo[0], city, lat, long, gender, age, Occupation, food_choice, religion, monthly_rent, minimum_stay, bathrooms, bedrooms, no_of_roommates, required_roommate, marital_status, gender_preference, preference_food_choice, preference_age, lifestyle, message })
        if (addRoommate) {

            for (const selectedInterest of interest_id) {
                await SelectedInterest.create({
                    roommate_id: addRoommate.id,
                    interest_id: selectedInterest
                });
            }

            for (const selectedSocial of social_id) {
                await SelectedSocial.create({
                    roommate_id: addRoommate.id,
                    social_id: selectedSocial
                });
            }

            for (const selectedLifestyle of lifestyle_id) {
                await SelectedLifestyle.create({
                    roommate_id: addRoommate.id,
                    lifestyle_id: selectedLifestyle
                });
            }

            //.................upload media ..............
            let mediaUrl = [];
            if (typeof req.files !== 'undefined' && req.files.length > 0) {
                mediaUrl = await uploadRoommateFiles(req.files, 'images/roommate_media');
            }

            for (const image of mediaUrl) {
                await Roommate_media.create({
                    roommate_id: addRoommate.id,
                    media: image,
                })
            }
        }

        const findRoommate = await Roommate.findOne({
            where: { id: addRoommate.id },
            include: [
                {
                    model: Roommate_media,
                    attributes: ['media', 'id']
                },

                {
                    model: SelectedInterest,
                    attributes: ['interest_id', 'id'],
                    include: [
                        {
                            model: Roommate_interests,
                            attributes: ['name', 'id']
                        }
                    ],
                },

                {
                    model: SelectedSocial,
                    attributes: ['social_id', 'id'],
                    include: [
                        {
                            model: Roommate_social,
                            attributes: ['name', 'id']
                        }
                    ],
                },
                {
                    model: SelectedLifestyle,
                    attributes: ['lifestyle_id', 'id'],
                    as: 'selectedLifestyles',
                    include: [
                        {
                            model: Lifestyle,
                            attributes: ['name', 'id']
                        }
                    ],
                },
            ],
        });

        return RESPONSE.success(res, 2201, findRoommate);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


//...............................get all roommate...............
const getAllRoommate = async (req, res) => {
    let validation = new Validator(req.query, {
        city: 'string',
        minimum_stay: 'numeric',
        min_budget: 'numeric|min:0',
        max_budget: 'numeric|min:0',
        bedrooms: 'numeric',
        bathrooms: 'numeric',
        gender: 'in:Male,Female,Both',
        food_choice: 'in:Vegetarian,Non-Vegetarian',
        lifestyle: 'array',
        'lifestyle.*': 'string'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const { city, age, minimum_stay, min_budget, max_budget, bedrooms, bathrooms, no_of_roommates, gender, food_choice, lifestyle } = req.query;

        let condition = {}
        let lifeStyleCondition = {}

        if (city) {
            condition.city = city;
        }
        if (age) {
            condition.age = age;
        }
        if (minimum_stay) {
            condition.minimum_stay = minimum_stay;
        }

        if (bedrooms) {
            condition.bedrooms = bedrooms;
        }
        if (bathrooms) {
            condition.bathrooms = bathrooms;
        }

        if (no_of_roommates) {
            condition.no_of_roommates = no_of_roommates;
        }

        if (min_budget && max_budget) {
            condition.monthly_rent = { [Op.gte]: min_budget, [Op.lte]: max_budget }
        }

        if (gender) {
            if (gender == "Both") {
                condition.gender = { [Op.in]: ['Male', 'Female'] }
            } else {
                condition.gender = gender
            }
        }

        if (food_choice) {
            condition.food_choice = food_choice
        }

        if (lifestyle) {
            lifeStyleCondition.lifestyle_id = { [Op.in]: lifestyle };
        }
        else {
            lifeStyleCondition
        }


        const findData = await Roommate.findAll({
            where: condition,
            include: [
                {
                    model: Roommate_media,
                    attributes: ['media', 'id']
                },
                {
                    model: SelectedLifestyle,
                    attributes: ['lifestyle_id', 'id'],
                    // where: { lifestyle_id: { [Op.in]: [1] } },
                    where: lifeStyleCondition,
                    required: true,
                    include: [
                        {
                            model: Lifestyle,
                            attributes: ['name', 'id']
                        }
                    ],
                },
            ]
        });


        if (!findData.length) {
            return RESPONSE.error(res, 2204);
        }

        return RESPONSE.success(res, 2203, findData);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}



//.................get roommate by id........................
const getRoommateById = async (req, res) => {
    let validation = new Validator(req.query, {
        id: 'required'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }
    try {
        const { id } = req.query;

        const findData = await Roommate.findOne({
            where: { id: id },
            include: [
                {
                    model: Roommate_media,
                    attributes: ['media', 'id']
                },

                {
                    model: SelectedInterest,
                    attributes: ['interest_id', 'id'],
                    include: [
                        {
                            model: Roommate_interests,
                            attributes: ['name', 'id']
                        }
                    ],
                },

                {
                    model: SelectedSocial,
                    attributes: ['social_id', 'id'],
                    include: [
                        {
                            model: Roommate_social,
                            attributes: ['name', 'id']
                        }
                    ],
                },
                {
                    model: SelectedLifestyle,
                    attributes: ['lifestyle_id', 'id'],
                    as: 'selectedLifestyles',
                    include: [
                        {
                            model: Lifestyle,
                            attributes: ['name', 'id']
                        }
                    ],
                },
            ],
        });

        if (!findData) {
            return RESPONSE.error(res, 2204);
        }

        return RESPONSE.success(res, 2203, findData);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}

//.....................get roommates............

const getRoommate = async (req, res) => {
    try {
        const { user: { id } } = req;

        const findData = await Roommate.findOne({
            where: { user_id: id },
            include: [
                {
                    model: Roommate_media,
                    attributes: ['media', 'id']
                },

                {
                    model: SelectedInterest,
                    attributes: ['interest_id', 'id'],
                    include: [
                        {
                            model: Roommate_interests,
                            attributes: ['name', 'id']
                        }
                    ],
                },

                {
                    model: SelectedSocial,
                    attributes: ['social_id', 'id'],
                    include: [
                        {
                            model: Roommate_social,
                            attributes: ['name', 'id']
                        }
                    ],
                },
                {
                    model: SelectedLifestyle,
                    attributes: ['lifestyle_id', 'id'],
                    as: 'selectedLifestyles',
                    include: [
                        {
                            model: Lifestyle,
                            attributes: ['name', 'id']
                        }
                    ],
                },
            ],
        });

        if (!findData) {
            return RESPONSE.error(res, 2204);
        }

        return RESPONSE.success(res, 2203, findData);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}

//.....................booking roommates............
const bookingRoommate = async (req, res) => {
    let validation = new Validator(req.body, {
        roommate_id: 'required',
        date: 'required|date',
        minimum_stay: 'required|numeric|min:1',
        age: 'required|numeric'
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }

    let trans = await db.sequelize.transaction();

    try {
        const { roommate_id, date, minimum_stay, age } = req.body;

        const authUser = req.user;

        const findRoommateData = await Roommate.findOne({ where: { id: roommate_id } });

        if (!findRoommateData) {
            await trans.rollback();
            return RESPONSE.error(res, 2204);
        }

        if (Number(minimum_stay) > Number(findRoommateData.minimum_stay)) {
            await trans.rollback();
            return RESPONSE.error(res, 2302);
        }

        const bookingData = await Roommate_booking.create({ date, minimum_stay, age, user_id: authUser.id, roommate_id: findRoommateData.id }, { transaction: trans })

        await trans.commit();
        return RESPONSE.success(res, 2301, bookingData);
    } catch (error) {

        await trans.rollback();
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}





module.exports = {
    addRoommate,
    getAllRoommate,
    getRoommateById,
    bookingRoommate,
    getRoommate

}
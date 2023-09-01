const Validator = require("validatorjs");
const db = require('../config/db.config');


//...................models............
const Roommate = db.roommate;
const Roommate_media = db.roommate_media;
const Roommate_social = db.roommate_socials;
const Roommate_interests = db.roommate_interests;
const SelectedSocial = db.selectedSocials
const SelectedInterest = db.selectedInterest
const { uploadRoommateFiles } = require('../helpers/file')


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
        minimum_stay: 'required|string',
        bathroom: 'required|in:Yes,No',
        required_roommate: 'required|numeric',
        marital_status: 'required|in:Single,Married',
        gender_preference: 'required|in:Male,Female,Other',
        preference_food_choice: 'required|in:Vegetarian,Non-Vegetarian',
        preference_age: 'required|in:12-18 Year,18-35 Year,35-50 Year',
        other: 'required|in:Pet Friendly,Non-smoker',
        message: 'required|string',
        interest_id: 'required|array',
        social_id: 'required|array',
    });
    if (validation.fails()) {
        firstMessage = Object.keys(validation.errors.all())[0];
        return RESPONSE.error(res, validation.errors.first(firstMessage))
    }

    try {
        const { city, lat, long, gender, age, Occupation, food_choice, religion, monthly_rent, minimum_stay, bathroom, required_roommate, marital_status, gender_preference, preference_food_choice, preference_age, other, interest_id, social_id, message } = req.body;

        const authUser = req.user

        const addRoommate = await Roommate.create({ city, lat, long, gender, age, Occupation, food_choice, religion, monthly_rent, minimum_stay, bathroom, required_roommate, marital_status, gender_preference, preference_food_choice, preference_age, other, message })

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

            //.................upload media ..............
            let mediaUrl = [];
            if (typeof req.files !== 'undefined' && req.files.length > 0) {
                mediaUrl = await uploadRoommateFiles(req.files, 'images/roommate_media');
            }

            for (const image of mediaUrl) {
                if (image.media_type == 1) {
                    await Roommate_media.create({
                        media_type: image.media_type,
                        roommate_id: addRoommate.id,
                        photo: image.roommate_media,
                    })
                } else {
                    await Roommate_media.create({
                        media_type: video.media_type,
                        roommate_id: addRoommate.id,
                        video: video.roommate_media,
                    })
                }
            }
        }


        const findRoommate = await Roommate.findOne({
            where: { id: addRoommate.id },
            include: [
                {
                    model: Roommate_media,
                    attributes: ['photo', 'video', 'id']
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
            ],
        });

        return RESPONSE.success(res, 2201, findRoommate);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }
}


module.exports = {
    addRoommate
}
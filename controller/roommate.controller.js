const Validator = require("validatorjs");
const db = require('../config/db.config');


//...................models............
const Roommate = db.roommate;
const Roommate_media = db.roommate_media;
const Roommate_social = db.roommate_socials;
const Roommate_interests = db.roommate_interests;
const SelectedSocial = db.selectedSocials
const SelectedInterest = db.selectedInterest
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

        let photo = [];
        if (typeof req.files !== 'undefined' && req.files.length > 0) {

            const data = req.files.filter((item) => item.fieldname == "image")
            if (data.length != 1) {
                return RESPONSE.error(res, 2202)
            }
            photo = await UploadFiles(data, 'images/roommate_media', 'image');
        }

        const addRoommate = await Roommate.create({ image: photo[0], city, lat, long, gender, age, Occupation, food_choice, religion, monthly_rent, minimum_stay, bathroom, required_roommate, marital_status, gender_preference, preference_food_choice, preference_age, other, message })
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
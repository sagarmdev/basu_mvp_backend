const Validator = require('validatorjs');
const db = require("../config/db.config");
const { Sequelize, Op } = require('sequelize');
const roomAmenitie = db.room_amenities;
const Media = db.media;
const roomRules = db.room_rules;
const Room = db.rooms;
const imageUpload = require('../helpers/file')

const addRooms = async (req, res) => {
    try {
        const authUser = req.user.id;
        const {
            title,
            // mediaUrl,
            description,
            roomType,
            bedRooms,
            bathRooms,
            tenant,
            liveWith,
            amenities,
            rules,
            houseRule,
            prefereOccupation,
            availibility,
            monthlyRent,
            minimumStay,
            roomSize,
            extraBills,
            city,
            lat,
            lng
        } = req.body;

        // if aminities is not in array formate then throw error
        if (amenities && amenities.length < 0) {
            return RESPONSE.error(res, 1110)
        }

        // if rules is not in array formate then throw error
        if (rules && rules.length < 0) {
            return RESPONSE.error(res, 1110)
        }

        // upload image on server and get path for store in database

        // console.log('mediaUrl', mediaUrl)
        console.log(req.files);
        let mediaUrl;
        if (typeof req.files !== 'undefined' && req.files.length > 0) {
            if (req.files[0].fieldname == 'mediaUrl') {
                mediaUrl = await imageUpload(req.files, 'image');
            }
        }
        // if (!mediaUrl || mediaUrl.length === 0) {
        //     return RESPONSE.error(res, 1110);
        // }



        const newRoom = await Room.create({
            user_id: authUser,
            title,
            description,
            // mediaUrl: mediaUrl,
            roomType,
            bedRooms,
            bathRooms,
            tenant,
            liveWith,
            houseRule,
            prefereOccupation,
            availibility,
            monthlyRent,
            minimumStay,
            roomSize,
            extraBills,
            city,
            lat,
            lng
        });
        let responseData = null;
        responseData = newRoom.toJSON();

        // create aminities in array of object formate for bulk create
        if (amenities != '' && typeof amenities != 'undefined') {
            let amenitieData = JSON.parse(amenities).map((item) => {
                return {
                    amenitieId: item,
                    roomId: newRoom.id,
                }
            })
            // console.log("amenitieData",amenitieData);

            // create bulk for aminities
            const createAmenities = await roomAmenitie.bulkCreate(amenitieData, {
                returning: true
            });
            // console.log('createAmenities', createAmenities)
            responseData.room_amenities = createAmenities
        }

        // create rules in array of object formate for bulk create
        if (rules != '' && typeof rules != 'undefined') {
            let rulesData = JSON.parse(rules).map((item) => {
                return {
                    rulesId: item,
                    roomId: newRoom.id,
                }
            })
            // console.log("amenitieData",amenitieData);

            // create bulk for aminities
            const createRules = await roomRules.bulkCreate(rulesData, {
                returning: true
            });
            // console.log('createAmenities', createAmenities)
            responseData.room_rules = createRules
        }



        // if image found in request data then update cover_image and  workspace_image
        if (typeof req.files !== 'undefined' && req.files.length > 0) {

            // check for workspace_image and cover_image, data is in request data or not
            const isWorkspaceImg = req.files.some((item) => item.fieldname == 'mediaUrl')
            console.log('isWorkspaceImg', isWorkspaceImg)
            // console.log('isWorkspaceImg', isWorkspaceImg)
            // if workspace image found then store
            if (isWorkspaceImg) {
                const workspace_imageArr = await imageUpload(req.files, 'image');
                console.log('workspace_imageArr', workspace_imageArr)

                const workspace_imagesData = workspace_imageArr.map((item) => ({
                    roomId: newRoom.id,
                    url: item
                }));
                // console.log('workspace_imagesData', workspace_imagesData)
                const createWorkspaceImage = await Media.bulkCreate(workspace_imagesData, {
                    returning: true
                });
                responseData.media = createWorkspaceImage;
            }
        }


        return RESPONSE.success(res, 1101, responseData);
    } catch (error) {
        console.log(error)
        return RESPONSE.error(res, error.message);
    }

}


module.exports = {
    addRooms
}

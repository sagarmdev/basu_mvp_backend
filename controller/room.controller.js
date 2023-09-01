const Validator = require('validatorjs');
const db = require("../config/db.config");
const { Sequelize, Op } = require('sequelize');
const roomAmenitie = db.room_amenities;
const Media = db.media;
const roomRules = db.room_rules;
const Room = db.rooms;
// const imageUpload = require('../helpers/file')
// const videoUpload = require('../helpers/file')

const addRooms = async (req, res) => {
    try {
        const authUser = req.user.id;
        const {
            title,
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
            return RESPONSE.error(res, 1103)
        }

        // if rules is not in array formate then throw error
        if (rules && rules.length < 0) {
            return RESPONSE.error(res, 1103)
        }

        // upload image on server and get path for store in database

        // console.log('mediaUrl', mediaUrl)
        // console.log(req.files);
        let mediaImg;
        if (typeof req.files !== 'undefined' && req.files.length > 0) {
            if (req.files[0].fieldname == 'mediaUrl') {
                mediaImg = await FILEACTION.imageUpload(req.files, 'image');
            }
        }

        let mediaVideo;
        if (typeof req.files !== 'undefined' && req.files.length > 0) {
            if (req.files[0].fieldname == 'mediaVideo') {
                mediaVideo = await FILEACTION.videoUpload(req.files, 'video');
            }
        }

        const newRoom = await Room.create({
            user_id: authUser,
            title,
            description,
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
            lng,
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


        let mediaData = [];

        if (typeof req.files !== 'undefined' && req.files.length > 0) {
            const isWorkspaceImg = req.files.some((item) => item.fieldname === 'mediaImg');
            const isWorkspaceVideo = req.files.some((item) => item.fieldname === 'mediaVideo');

            if (isWorkspaceImg || isWorkspaceVideo) {
                let workspace_imageArr = [];

                if (isWorkspaceImg) {
                    workspace_imageArr = await FILEACTION.imageUpload(req.files, 'image');
                    const mediaDataImg = workspace_imageArr.map((item) => ({
                        type: 1, // image
                        roomId: newRoom.id,
                        url: item
                    }));
                    mediaData.push(...mediaDataImg);
                }

                if (isWorkspaceVideo) {
                    workspace_imageArr = await FILEACTION.videoUpload(req.files, 'video');
                    const mediaDataVideo = workspace_imageArr.map((item) => ({
                        type: 2, // video
                        roomId: newRoom.id,
                        url: item
                    }));
                    mediaData.push(...mediaDataVideo);
                }

                if (mediaData.length > 0) {
                    const createMedia = await Media.bulkCreate(mediaData, {
                        returning: true
                    });

                    responseData.media = createMedia;
                }
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

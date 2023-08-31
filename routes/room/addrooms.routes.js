const router = require('express').Router()

const roomController = require('../../controller/addRoom.controller');
const roomTypeController = require('../../controller/roomType.controller');

const checkAuth = require('../../middleware/checkAuth')

//rooms 
router.post("/add-rooms", checkAuth.authUser, roomController.addRooms);

//rooms type
router.get("/get-roomType", roomTypeController.getAllType);




module.exports = router;
const router = require('express').Router()

const roomController = require('../../controller/room.controller');
const roomTypeController = require('../../controller/roomType.controller');
const roomBookingController = require('../../controller/room_booking.controller');

const checkAuth = require('../../middleware/checkAuth')

//rooms 
router.post("/add-rooms", checkAuth.authUser, roomController.addRooms);
router.get("/get-all-rooms", roomController.getAllRooms);
router.get("/get-all-rooms-by-id", checkAuth.authUser, roomController.getAllRoomsById);

router.post('/booking-room',checkAuth.authUser,roomBookingController.bookingRoom)
//rooms type
router.get("/get-roomType", roomTypeController.getAllType);




module.exports = router;
const router = require('express').Router()

//................middleware......................
const Auth = require('../../middleware/checkAuth')

//.....................controller............
const RoommateController = require('../../controller/roommate.controller');


router.post('/add-room-mate', Auth.authUser, RoommateController.addRoommate);

router.get('/get-all-room-mate', Auth.authUser, RoommateController.getAllRoommate);

router.get('/get-room-mate-by-id', Auth.authUser, RoommateController.getRoommateById);

router.post('/book-roommate',Auth.authUser,RoommateController.bookingRoommate)


module.exports = router;
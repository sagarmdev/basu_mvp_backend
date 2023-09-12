const router = require('express').Router()

//................middleware......................
const Auth = require('../../middleware/checkAuth')

//.....................controller............
const RoommateController = require('../../controller/roommate.controller');


router.post('/add-room-mate', Auth.authUser, RoommateController.addRoommate);

router.get('/get-all-room-mate', Auth.authUser, RoommateController.getAllRoommate);

router.get('/get-room-mate-by-id', Auth.authUser, RoommateController.getRoommateById);

router.get('/get-room', Auth.authUser, RoommateController.getRoommate);

router.post('/book-roommate', Auth.authUser, RoommateController.bookingRoommate)

router.patch('/update-roommate/:id', Auth.authUser, RoommateController.updateRoommate)

router.delete('/delete-roommate', Auth.authUser, RoommateController.deleteRoommateMedia)


module.exports = router;
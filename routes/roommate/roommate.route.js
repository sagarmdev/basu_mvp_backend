const router = require('express').Router()

//................middleware......................
const Auth = require('../../middleware/checkAuth')

//.....................controller............
const RoommateController = require('../../controller/roommate.controller');


router.post('/add-room-mate',Auth.authUser,RoommateController.addRoommate); 



module.exports = router;
const router = require('express').Router()

//................middleware......................
const Auth = require('../../middleware/checkAuth');

//.....................controller............
const eventController = require('../../controller/event.controller');


router.get('/get-event-categories', Auth.authUser,eventController.getAllEventCategories);

router.get('/get-event-amenities', Auth.authUser, eventController.getAllEventAmenities);

router.post('/create-event', Auth.authUser, eventController.createEvent) //



module.exports = router;
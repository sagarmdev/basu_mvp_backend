const router = require('express').Router()

//................middleware......................
const Auth = require('../../middleware/checkAuth');

//.....................controller............
const eventController = require('../../controller/event.controller');


router.get('/get-event-categories', Auth.authUser, eventController.getAllEventCategories);

router.get('/get-event-amenities', Auth.authUser, eventController.getAllEventAmenities);

router.post('/create-event', Auth.authUser, eventController.createEvent)

router.get('/get-event', Auth.authUser, eventController.getEvent)

router.post('/booking-event', Auth.authUser, eventController.eventBooking)

router.patch('/update-event/:id', Auth.authUser, eventController.updateEvent)

router.delete('/delete-event', Auth.authUser, eventController.deleteEventPhotos)


module.exports = router;
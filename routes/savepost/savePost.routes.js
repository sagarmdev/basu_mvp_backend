const router = require('express').Router()

const saveController = require('../../controller/savePost.controller');
// const notificationController = require('../../controller/notification.controller');

const checkAuth = require('../../middleware/checkAuth')

router.post("/add-savepost", checkAuth.authUser, saveController.savePost);
router.get("/get-savepost", checkAuth.authUser, saveController.getSavePost);

// router.get('/notifications', checkAuth.authUser, notificationController.notification);

// router.get('/get-room-notification', checkAuth.authUser, notificationController.getRommmateNotification);

// router.get('/get-room-notification', checkAuth.authUser, notificationController.getRommNotification);


module.exports = router;
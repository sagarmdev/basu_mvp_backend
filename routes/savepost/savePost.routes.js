const router = require('express').Router()

const saveController = require('../../controller/savePost.controller');

const checkAuth = require('../../middleware/checkAuth')

router.post("/add-savepost", checkAuth.authUser, saveController.savePost);
// router.get("/get-all-rooms", roomController.getAllRooms);





module.exports = router;
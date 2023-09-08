const router = require('express').Router()

//................middleware......................
const Auth = require('../../middleware/checkAuth');

//.....................controller............
const cardController = require('../../controller/card.controller');

router.post('/add-card', Auth.authUser, cardController.addCard)


module.exports = router;
const router = require('express').Router()

//................middleware......................
const Auth = require('../../middleware/checkAuth');

//.....................controller............
const ItemController = require('../../controller/item.controller');
const { authPlugins } = require('mysql2');


router.get('/get-item-categories', Auth.authUser, ItemController.getAllItemsCategories);

router.post('/create-item', Auth.authUser, ItemController.addItem);

router.post('/get-all-rent-and-sale', Auth.authUser, ItemController.getAllRentAndSale);

router.post('/get-rent-and-sale-by-id', Auth.authUser, ItemController.getRentAndSaleById);

router.post('/booking-rent-item', Auth.authUser, ItemController.bookingRentItem);

module.exports = router;
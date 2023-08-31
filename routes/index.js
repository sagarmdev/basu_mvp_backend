const router = require('express').Router()

// auth routes
const authRoutes = require("./auth/auth.routes");
router.use("/user", authRoutes);

//rooms routes
const roomRoutes = require('./room/addrooms.routes')
router.use("/room", roomRoutes);

//event routes
const eventRoutes = require("./event/event.routes");
router.use('/event', eventRoutes);

//item routes
const itemRoutes = require('./item/item.route');
router.use('/item', itemRoutes);

//roommate routes
const roommateRoutes = require('./roommate/roommate.route');
router.use('/roommate', roommateRoutes);


module.exports = router;
const router = require('express').Router()

// auth routes
const authRoutes = require("./auth/auth.routes");
router.use("/user", authRoutes);

//rooms routes
const roomRoutes = require('./room/addrooms.routes')
router.use("/room", roomRoutes);

module.exports = router;
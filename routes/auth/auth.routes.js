const router = require('express').Router()

const authController = require('../../controller/auth.controller');

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

// reset resetPassword
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);



module.exports = router;
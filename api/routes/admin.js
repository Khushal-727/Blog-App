const express = require("express");
const router = express.Router();
const adminController = require('../controllers/admin');
const checkAuth = require("../middleware/check-auth");

router.post("/login", adminController.admin_Login);
router.post("/logout", checkAuth, adminController.admin_Logout);

router.post("/signup",  adminController.admin_Signup);

module.exports = router;
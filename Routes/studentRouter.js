const express = require("express");
const studentController = require("./../Controllers/studentController");
const authController = require("./../Controllers/authController");
const router = express.Router();

router.route("/").post(authController.studentLogin);
module.exports = router;

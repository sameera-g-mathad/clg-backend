const express = require("express");
const studentController = require("./../Controllers/studentController");
const authController = require("./../Controllers/authController");
const paperController = require("./../Controllers/PaperController");
const router = express.Router();

router.route("/").post(authController.studentLogin);
router.route("/internals").get(paperController.getPaperforStudent);
module.exports = router;

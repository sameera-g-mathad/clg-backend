const authController = require("./../Controllers/authController");
const express = require("express");

const router = express.Router();

router.route("/").post(authController.resetPassword);
router.route("/:resetToken").patch(authController.setNewPassword);

module.exports = router;

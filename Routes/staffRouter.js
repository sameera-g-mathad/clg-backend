const express = require("express");
const staffController = require("./../Controllers/StaffController");
const authController = require("./../Controllers/authController");
const paperController = require("./../Controllers/PaperController");
const router = express.Router();

router.route("/").post(authController.login);
//router.route("/").get(authController.protect,staffController.getStaff)
router.route("/").get(staffController.getTeacherbyId);
router.route("/set-paper").get(paperController.getInternalsDetails);
router.route("/set-paper/questions").post(paperController.addPaper);
router.route("/students").get(staffController.getStudents);
router
  .route("/students/internals1/:usn")
  .get(paperController.findpapers)
  .patch(staffController.updateInternals1);
router
  .route("/students/internals2/:usn")
  .get(paperController.findpapers)
  .patch(staffController.updateInternals2);
router
  .route("/students/internals3/:usn")
  .get(paperController.findpapers)
  .patch(staffController.updateInternals3);
module.exports = router;

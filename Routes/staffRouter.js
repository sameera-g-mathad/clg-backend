const express = require("express");
const staffController = require("./../Controllers/StaffController");
const authController = require("./../Controllers/authController");
const paperController = require("./../Controllers/PaperController");
const router = express.Router();

router.route("/").post(authController.login);
//router.route("/").get(authController.protect,staffController.getStaff)
router
  .route("/")
  .get(authController.protectTeacher, staffController.getTeacherbyId);
router
  .route("/set-paper")
  .get(authController.protectTeacher, paperController.getInternalsDetails);
router
  .route("/set-paper/questions")
  .post(authController.protectTeacher, paperController.addPaper);
router.route("/students").get(staffController.getStudents);
router
  .route("/students/internals1/:usn")
  .get(authController.protectTeacher, paperController.findpapers)
  .patch(authController.protectTeacher, staffController.updateInternals1);
router
  .route("/students/internals2/:usn")
  .get(authController.protectTeacher, paperController.findpapers)
  .patch(authController.protectTeacher, staffController.updateInternals2);
router
  .route("/students/internals3/:usn")
  .get(authController.protectTeacher, paperController.findpapers)
  .patch(authController.protectTeacher, staffController.updateInternals3);

router
  .route("/co-analysis/:id")
  .get(authController.protectTeacher, paperController.getPapers);
module.exports = router;

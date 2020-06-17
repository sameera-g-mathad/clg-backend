const express = require("express");
const cordinatorController = require("./../Controllers/cordinatorController");
const router = express.Router();
const authController = require("./../Controllers/authController");

router.route("/").post(authController.cordinatorlogin);
router
  .route("/staff")
  .get(authController.protectCordinator, cordinatorController.getStaff)
  .post(
    authController.protectCordinator,
    cordinatorController.uploadImage,
    cordinatorController.resizeImage,
    cordinatorController.readImage,
    cordinatorController.createStaff
  )
  .patch(authController.protectCordinator, cordinatorController.deleteSubjects)
  .delete(authController.protectCordinator, cordinatorController.deleteTeacher);

router
  .route("/staff/:id")
  .get(
    authController.protectCordinator,
    cordinatorController.getSubject,
    cordinatorController.getTeacher
  )
  .patch(authController.protectCordinator, cordinatorController.editStaff);

router
  .route("/subjects")
  .get(authController.protectCordinator, cordinatorController.getSubjects)
  .post(authController.protectCordinator, cordinatorController.createSubject)
  .delete(authController.protectCordinator, cordinatorController.deleteSubject);

router
  .route("/students")
  .get(authController.protectCordinator, cordinatorController.getStudents)
  .post(
    authController.protectCordinator,
    cordinatorController.studentPhotoUpload,
    cordinatorController.studentPhotoResize,
    cordinatorController.studentPhotoRead,
    cordinatorController.createStudent
  )
  .delete(authController.protectCordinator, cordinatorController.deleteStudent)
  .patch(authController.protectCordinator, cordinatorController.updateStudent);

module.exports = router;

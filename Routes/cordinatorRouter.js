const express = require("express");
const cordinatorController = require("./../Controllers/cordinatorController");
const router = express.Router();
// const authController = require("./../Controllers/authController");

// router.route("/");
router
  .route("/staff")
  .get(cordinatorController.getStaff)
  .post(
    cordinatorController.uploadImage,
    cordinatorController.resizeImage,
    cordinatorController.readImage,
    cordinatorController.createStaff
  )
  .patch(cordinatorController.deleteSubjects)
  .delete(cordinatorController.deleteTeacher);

router
  .route("/staff/:id")
  .get(cordinatorController.getSubject, cordinatorController.getTeacher)
  .patch(cordinatorController.editStaff);

router
  .route("/subjects")
  .get(cordinatorController.getSubjects)
  .post(cordinatorController.createSubject)
  .delete(cordinatorController.deleteSubject);

router
  .route("/students")
  .get(cordinatorController.getStudents)
  .post(
    cordinatorController.studentPhotoUpload,
    cordinatorController.studentPhotoResize,
    cordinatorController.studentPhotoRead,
    cordinatorController.createStudent
  )
  .delete(cordinatorController.deleteStudent).patch(cordinatorController.updateStudent);

module.exports = router;

const express = require("express");
const cordinatorController = require("./../Controllers/cordinatorController");
const router = express.Router();

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
  .post(cordinatorController.createSubject);

router
  .route("/students")
  .get(cordinatorController.getStudents)
  .post(
    cordinatorController.studentPhotoUpload,
    cordinatorController.studentPhotoResize,
    cordinatorController.studentPhotoRead,
    cordinatorController.createStudent
  )
  .delete(cordinatorController.deleteStudent);

module.exports = router;

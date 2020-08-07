const Staff = require("../Models/StaffModel");
const Subject = require("../Models/SubjectModel");
const Student = require("./../Models/StudentModel");
const AppError = require("./../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const QuestionPaper = require("./../Models/PaperModel");
//catch err
catchErr = (err, res) => {
  res.status(404).json({
    status: "fail",
    message: err,
  });
};
//Teachers
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("invalid file", 400), false);
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});

exports.uploadImage = upload.single("photo");
exports.resizeImage = async (req, res, next) => {
  const name = req.body.name;
  req.file.filename = `${name}.jpeg`;
  req.file.path = `uploads/teachers/${req.file.filename}`;
  const resize = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(req.file.path);

  next();
};
exports.readImage = (req, res, next) => {
  req.file.image = fs.readFileSync(req.file.path);
  if (req.file.image !== undefined) next();
};
exports.createStaff = async (req, res, next) => {
  try {
    const { name, email, dept, cordinator } = req.body;
    const image = req.file.image;
    if (!name || !email || !dept)
      return next(new AppError("Insufficient details", 406));
    const newUser = await Staff.create({
      name,
      email,
      dept,
      cordinator,
      photo: {
        data: image,
        contentType: "image/jpeg",
      },
    });
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};
exports.editStaff = async (req, res, next) => {
  try {
    const { _id: id, subject1, subject2 } = req.body;
    if (!id) return next(new AppError("User Info Incorrect", 404));
    if (!subject1 || !subject2)
      return next(new AppError("Subjects Info Incorrect", 404));
    const Subject1 = await Subject.findById(subject1);
    const Subject2 = await Subject.findById(subject2);
    const sub1 = Subject1.subjectName;
    const sub2 = Subject2.subjectName;
    const Edited = await Staff.findByIdAndUpdate(id, {
      subject1_Id: subject1,
      subject1: sub1,
      subject2_Id: subject2,
      subject2: sub2,
      modifiedAt: Date.now(),
    });
    if (!Edited) return next(new AppError("Subjects Not Updated", 404));
    const Sub1Edit = await Subject.findByIdAndUpdate(subject1, {
      assigned: true,
    });
    const Sub2Edit = await Subject.findByIdAndUpdate(subject2, {
      assigned: true,
    });
    res.status(200).json({
      status: "success",
      Edited,
      Sub1Edit,
      Sub2Edit,
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.getStaff = async (req, res, next) => {
  try {
    const { dept } = req.headers;
    const StaffDetails = await Staff.find({ dept }).sort({ name: 1 });
    if (!StaffDetails) return next(new AppError("No teachers available", 404));

    res.status(200).json({
      status: "success",
      StaffDetails,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "not found",
    });
  }
};
exports.deleteSubjects = async (req, res, next) => {
  try {
    const { id, subject1_Id, subject2_Id } = req.body.headers;
    const subject1 = await Subject.findByIdAndUpdate(subject1_Id, {
      assigned: false,
    });
    const subject2 = await Subject.findByIdAndUpdate(subject2_Id, {
      assigned: false,
    });
    const teacher = await Staff.findByIdAndUpdate(id, {
      $unset: { subject1_Id: "", subject1: "", subject2_Id: "", subject2: "" },
    });
    const deleted = await QuestionPaper.deleteMany({ teacherId: id });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.getSubject = async (req, res, next) => {
  try {
    const dept = req.headers.dept;
    const { semester1, section1 } = req.headers;
    const { semester2, section2 } = req.headers;
    let subject1, subject2;
    if (
      semester1 === undefined &&
      section1 === undefined &&
      semester2 === undefined &&
      section2 === undefined
    )
      next();
    try {
      if (semester2 !== undefined && section2 !== undefined) {
        subject2 = await Subject.find({
          dept,
          sem: semester2,
          section: section2,
          assigned: { $ne: true },
        });
        res.status(200).json({
          status: "success",
          subject2,
        });
      }
    } catch (err) {
      catchErr(err, res);
    }
    try {
      if (semester1 !== undefined && section1 !== undefined) {
        subject1 = await Subject.find({
          dept,
          sem: semester1,
          section: section1,
          assigned: { $ne: true },
        });
        res.status(200).json({
          status: "success",
          subject1,
        });
      }
    } catch (err) {
      catchErr(err, res);
    }
  } catch (err) {
    catchErr(err, res);
  }
};
exports.getTeacher = async (req, res, next) => {
  try {
    const id = req.params.id;
    const Teacher = await Staff.findById(id);
    if (!Teacher) return next(new AppError("No Teachers found", 404));

    res.status(200).json({
      status: "success",
      Teacher,
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.deleteTeacher = async (req, res, next) => {
  try {
    const { id, subject1_id, subject2_id } = req.headers;
    let subject1, subject2;
    if (subject1_id !== "undefined") {
      subject1 = await Subject.findByIdAndUpdate(subject1_id, {
        assigned: false,
      });
    }
    if (subject2_id !== "undefined") {
      subject2 = await Subject.findByIdAndUpdate(subject2_id, {
        assigned: false,
      });
    }
    const deleted = await Staff.findByIdAndDelete(id);
    const deletedPapers = await QuestionPaper.deleteMany({ teacherId: id });
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    catchErr(err, res);
  }
};

//Subjects
exports.createSubject = async (req, res, next) => {
  const { subjectName, subjectCode, dept, sem, section, elective } = req.body;
  try {
    const subcheck = await Subject.find({ subjectCode, dept, sem, section });

    if (subcheck.length >= 1)
      return next(new AppError("Subject your requesting already exists", 406));
    const newSubject = await Subject.create({
      subjectName,
      subjectCode,
      dept,
      sem,
      section,
      elective,
    });
    res.status(201).json({
      status: "success",
      newSubject,
    });
  } catch (err) {
    console.log(err);
    res.send("ok2");
  }
};
exports.getSubjects = async (req, res, next) => {
  try {
    const { dept } = req.headers;
    const Subjects = await Subject.find({ dept })
      .sort({ sem: 1 })
      .sort({ section: 1 })
      .sort({ subjectCode: 1 });
    if (Subjects.length === 0)
      return next(new AppError("No subjects available", 404));
    res.status(200).json({
      status: "success",
      Subjects,
    });
  } catch (err) {
    catchErr(err);
  }
};
exports.deleteSubject = async (req, res, next) => {
  try {
    const { _id } = req.headers;
    const deletedSubject = await Subject.findByIdAndDelete({ _id });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    catchErr(err, res);
  }
};
//Students
const multerStudentStorage = multer.memoryStorage();
const multerStudentFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("invalid file", 404), false);
};
const studentPhoto = multer({
  storage: multerStudentStorage,
  fileFilter: multerStudentFilter,
  limits: {
    fileSize: 1024 * 1024 * 6,
  },
});
exports.studentPhotoUpload = studentPhoto.single("photo");

exports.studentPhotoResize = async (req, res, next) => {
  const name = req.body.studentName;
  req.file.filename = `${name}.jpeg`;
  req.file.path = `uploads/students/${req.file.filename}`;
  const resizedImage = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(req.file.path);
  next();
};
exports.studentPhotoRead = (req, res, next) => {
  req.file.image = fs.readFileSync(req.file.path);
  if (req.file.image !== undefined) next();
};
exports.createStudent = async (req, res, next) => {
  try {
    const { studentName, studentUsn, dept, dob, year, sem, section } = req.body;
    const image = req.file.image;
    const newStudent = await Student.create({
      //studentEmail,
      studentName,
      studentUsn,
      dept,
      dob,
      year,
      sem,
      section,
      photo: {
        data: image,
        contentType: "image/jpeg",
      },
    });
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      status: "success",
      newStudent,
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.getStudents = async (req, res, next) => {
  try {
    const { dept } = req.headers;
    const Students = await Student.find({ dept }).sort({ studentUsn: 1 });
    if (Students.length === 0)
      return next(new AppError("No students found", 404));
    res.status(200).json({
      status: "success",
      Students,
    });
  } catch (err) {
    console.log(err);
    catchErr(err, res);
  }
};
exports.deleteStudent = async (req, res, next) => {
  try {
    const _id = req.headers.id;
    const deleted = await Student.findByIdAndDelete(_id);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.updateStudent = async (req, res, next) => {
  try {
    console.log(req.body);
    const { _id, updatestudentSem: sem, updatestudentYear: year } = req.body;
    const updated = await Student.findByIdAndUpdate(_id, { year, sem });
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(404).json({ status: "failed" });
  }
};

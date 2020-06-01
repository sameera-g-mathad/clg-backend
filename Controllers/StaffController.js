const Staff = require("../Models/StaffModel");
const Student = require("./../Models/StudentModel");
const Subject = require("./../Models/SubjectModel");
const AppError = require("./../utils/appError");
catchErr = (err, res) => {
  res.status(404).json({
    status: "fail",
    msg: err,
  });
};

exports.getTeacherbyId = async (req, res, next) => {
  try {
    const id = req.headers.teacherid;
    const staffDetails = await Staff.findById(id).select({
      name: 1,
      dept: 1,
      email: 1,
      subject1_Id: 1,
      subject2_Id: 1,
      photo: 1,
    });
    const { subject1_Id, subject2_Id } = staffDetails;
    const subject1 = await Subject.findById(subject1_Id);
    const subject2 = await Subject.findById(subject2_Id);
    if (!subject1 || !subject2)
      return next(new AppError("Something went wrong", 404));
    res.status(200).json({
      status: "success",
      staffDetails,
      subject1,
      subject2,
    });
  } catch (err) {
    catchErr(err, res);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const { dept, sem, section } = req.headers;
    const Students = await Student.find({ dept, sem, section })
      .select({
        studentName: 1,
        studentUsn: 1,
        dept: 1,
        year: 1,
        sem: 1,
        section: 1,
        internals1: 1,
        internals2: 1,
        internals3: 1,
        photo: 1,
      })
      .sort({
        studentUsn: 1,
      });
    res.status(200).json({
      status: "success",
      Students,
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.updateInternals1 = async (req, res, next) => {
  try {
    const { internals1 } = req.body;
    const { usn } = req.params;
    const updated = await Student.findOneAndUpdate(
      { studentUsn: usn },
      {
        $push: {
          internals1: {
            subject: internals1.subject,
            subjectCode: internals1.subjectCode,
            sem: internals1.sem,
            performance: internals1.performance,
            marks: internals1.marks,
          },
        },
      }
    );
    const updatedDoc = await Student.findById(updated._id);
    res.status(200).json({
      status: "success",
      updatedDoc,
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.updateInternals2 = async (req, res, next) => {
  try {
    const { internals2 } = req.body;
    console.log(internals2);
    const { usn } = req.params;
    const updated = await Student.findOneAndUpdate(
      { studentUsn: usn },
      {
        $push: {
          internals2: {
            subject: internals2.subject,
            subjectCode: internals2.subjectCode,
            sem: internals2.sem,
            performance: internals2.performance,
            marks: internals2.marks,
          },
        },
      }
    );
    const updatedDoc = await Student.findById(updated._id);
    res.status(200).json({
      status: "success",
      updatedDoc,
    });
  } catch (err) {
    catchErr(err, res);
  }
};
exports.updateInternals3 = async (req, res, next) => {
  try {
    const { internals3 } = req.body;
    const { usn } = req.params;
    const updated = await Student.findOneAndUpdate(
      { studentUsn: usn },
      {
        $push: {
          internals3: {
            subject: internals3.subject,
            subjectCode: internals3.subjectCode,
            sem: internals3.sem,
            performance: internals3.performance,
            marks: internals3.marks,
          },
        },
      }
    );
    const updatedDoc = await Student.findById(updated._id);
    res.status(200).json({
      status: "success",
      updatedDoc,
    });
  } catch (err) {
    catchErr(err, res);
  }
};

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Staff = require("./../Models/StaffModel");
const Student = require("./../Models/StudentModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Incorrect email or password", 400));

  const staff = await Staff.findOne({ email }).select("+password");

  if (!staff || !(await staff.checkPassword(password, staff.password)))
    return next(new AppError("Incorrect email or password", 401));

  const teacherToken =
    "Teacher" +
    jwt.sign({ id: staff._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
  staff.password = undefined;
  res.status(200).json({
    status: "success",
    teacherToken,
    staff,
  });
});
// exports.protect=catchAsync(async(req,res,next)=>{
//     let token;
//     if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
//     {

//     }
// })

exports.studentLogin = async (req, res, next) => {
  try {
    const { studentUsn, password } = req.body;
    console.log(studentUsn, password);
    if (!studentUsn || !password)
      return next(new AppError("Invalid details", 404));
    const student = await Student.findOne({ studentUsn }).select("+password");

    if (!student || !(await student.check(password, student.password)))
      return next(new AppError("Invalid Usn or Password", 404));
    const studentToken =
      "Student " +
      jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      });
    student.password = undefined;
    res.status(200).json({
      status: "success",
      studentToken,
      student,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
    });
  }
};
exports.cordinatorlogin = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Invalid details", 400));
    }
    const cordinator = await Staff.findOne({ email }).select("+password");
    if (
      !cordinator ||
      !cordinator.cordinator ||
      !(await cordinator.checkPassword(password, cordinator.password))
    )
      return next(new AppError("Invalid details", 400));
    const cordinatorToken =
      "Cordinator" +
      " " +
      jwt.sign({ id: cordinator._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      });

    res.status(200).json({
      status: "success",
      cordinatorToken,
      cordinator,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
    });
  }
};
exports.protectCordinator = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Cordinator")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Something went wrong", 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log("hello", decoded);
    const user = await Staff.findById(decoded.id);
    if (!user) return next(new AppError("No user found", 401));
    else next();
  } catch (err) {
    res.status(404).json({
      status: "failed while processing",
    });
  }
};

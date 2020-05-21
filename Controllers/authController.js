const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Staff = require("./../Models/StaffModel");
const Student = require("./../Models/StudentModel");
const jwt = require("jsonwebtoken");
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Incorrect email or password", 400));

  const staff = await Staff.findOne({ email }).select("+password");

  if (!staff || !(await staff.checkPassword(password, staff.password)))
    return next(new AppError("Incorrect email or password", 401));

  const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  staff.password = undefined;
  res.status(200).json({
    status: "success",
    token,
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
  } catch (err) {}
};

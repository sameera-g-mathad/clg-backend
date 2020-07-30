const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Staff = require("./../Models/StaffModel");
const Student = require("./../Models/StudentModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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
    " " +
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
exports.protectTeacher = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Teacher")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new AppError("Something went wrong", 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log("hello", decoded);
    const user = await Staff.findById(decoded.id);
    if (!user) return next(new AppError("No user found", 401));
    else next();
  } catch (err) {
    res.status(404).json({
      status: "failed while processing",
    });
  }
};
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
      "Student" +
      " " +
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
    //console.log("hello", decoded);
    const user = await Staff.findById(decoded.id);
    if (!user) return next(new AppError("No user found", 401));
    else next();
  } catch (err) {
    res.status(404).json({
      status: "failed while processing",
    });
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const user = await Staff.findOne({ email });
    //console.log(user);
    if (!user) {
      return next(new AppError("sorry email not found .", 404));
    }
    const resetToken = user.resetPasswordToken();
    console.log(resetToken);
    await user.save({ validateBeforeSave: false });
    const url = req.get("host").split(":")[0];
    const resethost = url + ":3000";
    const resetUrl = `${req.protocol}://${resethost}/resetPassword/${resetToken}`;
    sendmail(user.email, resetUrl);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
};
sendmail = async (email, resetUrl) => {
  try {
    const transport = nodemailer.createTransport({
      service: process.env.SERVICE,
      port: process.env.EPORT,
      auth: {
        user: process.env.USER,
        pass: process.env.EPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SERVER_MAIL,
      to: email,
      subject: "Reset Password",
      html: `<div>
          <h5>Hello</h5>
          
          <p>This message is from global academy of technology.The link below is for re-setting password as per your
              request.
              The link will expire in 5 minutes and once after changin your password you can login using your new
              password.Never share your password with anyone. </p>
          <a target="block" href="${resetUrl}">${resetUrl}</a>
          <p style="color:red">Regards,<br>Global Academy Of Technology</p>
      </div>`,
    };
    await transport.sendMail(mailOptions);
  } catch (err) {
    console.log("error", err);
  }
};
exports.setNewPassword = async () => {};

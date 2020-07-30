const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Email not valid"],
  },
  password: {
    type: String,
    required: [true, "password not found"],
    default: "global12345",
    minlength: 10,
    select: false,
  },
  dept: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: [3, "only 3"],
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  cordinator: {
    type: Boolean,
  },
  subject1_Id: {
    type: mongoose.Schema.ObjectId,
    ref: "Subjects",
  },
  subject1: String,
  subject2_Id: {
    type: mongoose.Schema.ObjectId,
    ref: "Subjects",
  },
  subject2: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  modifiedAt: {
    type: Date,
    select: false,
  },
  passwordReset: String,
  passwordExpires: Date,
});
staffSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
staffSchema.methods.checkPassword = async function(
  enteredpassword,
  dbpassword
) {
  return await bcrypt.compare(enteredpassword, dbpassword);
};

staffSchema.methods.resetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordReset = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordExpires = Date.now() + 5 * 60 * 1000;

  return resetToken;
};
const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;

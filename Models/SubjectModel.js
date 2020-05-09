const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
    uppercase: true,
  },
  dept: {
    type: String,
    required: true,
    maxlength: 3,
    uppercase: true,
  },
  sem: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  section: {
    type: String,
    required: true,
    maxlength: 1,
    uppercase: true,
  },
  elective: {
    type: Boolean,
    required: true,
    default: false,
  },
  assigned: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;

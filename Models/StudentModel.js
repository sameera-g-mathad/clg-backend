const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  studentUsn: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 10,
    uppercase: true,
  },
  dept: {
    type: String,
    required: true,
    maxlength: 3,
    uppercase: true,
  },
  year: {
    type: Number,
    required: true,
    min: [1, "Value must be greater or equal than 1"],
    max: [4, "Value must be lesser or equal than 4"],
  },
  sem: {
    type: Number,
    required: true,
    min: [1, "Value must be greater or equal than 1"],
    max: [8, "Value must be lesser or equal than 8"],
  },
  section: {
    type: String,
    required: true,
    maxlength: 1,
    uppercase: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  internals1: [
    {
      subject: String,
      performance: [
        {
          questionNumber: {
            type: Number,
            required: true,
          },
          question: {
            type: Number,
            required: true,
          },
          co: {
            type: String,
            maxlength: 3,
            required: true,
          },
          subquestions: [
            {
              type: Number,
            },
          ],
        },
      ],
      marks: Number,
    },
  ],
  internals2: [
    {
      subject: String,
      performance: [
        {
          questionNumber: {
            type: Number,
            required: true,
          },
          question: {
            type: Number,
            required: true,
          },
          co: {
            type: String,
            maxlength: 3,
            required: true,
          },
          subquestions: [
            {
              type: Number,
            },
          ],
        },
      ],
      marks: Number,
    },
  ],
  internals3: [
    {
      subject: String,
      performance: [
        {
          questionNumber: {
            type: Number,
            required: true,
          },
          question: {
            type: Number,
            required: true,
          },
          co: {
            type: String,
            maxlength: 3,
            required: true,
          },
          subquestions: [
            {
              type: Number,
            },
          ],
        },
      ],
      marks: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

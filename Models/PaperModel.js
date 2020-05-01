const mongoose = require("mongoose");

const paperSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  subjectCode: {
    type: String,
    required: true
  },
  dept: {
    type: String,
    required: true,
    maxlength: 3,
    uppercase: true
  },
  sem: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  section: {
    type: String,
    required: true,
    maxlength: 1
  },
  internals: {
    type: String,
    required: true
  },
  questions: {
    type: Number,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.ObjectId,
    ref: "Staff"
  },
  questionpaper: [
    {
      questionNumber: {
        type: Number,
        required: true
      },
      question: {
        type: Number,
        required: true
      },
      co: {
        type: String,
        maxlength: 3,
        required: true
      },
      subquestions: [
        {
          type: Number
        }
      ]
    }
  ]
});
const QuestionPapers = mongoose.model("QuestionPapers", paperSchema);
module.exports = QuestionPapers;

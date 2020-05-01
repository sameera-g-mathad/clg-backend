const QuestionPaper = require("./../Models/PaperModel");
const AppError = require("./../utils/appError");
exports.addPaper = async (req, res, next) => {
  try {
    console.log(req.body);
    const newPaper = await QuestionPaper.create(req.body);
    res.status(200).json({
      status: "success",
      newPaper,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
    });
  }
};
exports.findpapers = async (req, res, next) => {
  try {
    const {
      teacherid: teacherId,
      subject,
      sem,
      section,
      dept,
      internals,
    } = req.headers;
    const found = await QuestionPaper.findOne({
      teacherId,
      subject,
      sem,
      section,
      dept,
      internals,
    });
    if (found === null) {
      return next(
        new AppError(
          `The question paper for ${internals} could not be found `,
          404
        )
      );
    }
    res.status(200).json({
      status: "success",
      found,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
    });
  }
};
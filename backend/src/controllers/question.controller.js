const { QUESTIONS } = require("../models/question.model");

module.exports.getQuestions = function (req, res) {
  try {
    const { ageGroup } = req.params;

    const validAgeGroups = ["18-24", "24-30", "30-40", "40-60"];
    if (!validAgeGroups.includes(ageGroup)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid age group. Must be one of: 18-24, 24-30, 30-40, 40-60",
      });
    }

    return res.status(200).json({
      success: true,
      data: QUESTIONS[ageGroup],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

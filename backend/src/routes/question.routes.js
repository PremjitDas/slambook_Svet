const { Router } = require("express");
const questionController = require("../controllers/question.controller");

const questionRouter = Router();

questionRouter.route("/:ageGroup").get(questionController.getQuestions);

module.exports = questionRouter;

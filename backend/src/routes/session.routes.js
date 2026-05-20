const { Router } = require("express");
const sessionController = require("../controllers/session.controller");

const sessionRouter = Router();

sessionRouter.route("/").post(sessionController.createSession);
sessionRouter.route("/:share_code").get(sessionController.getSession);
sessionRouter.route("/:share_code/submit").post(sessionController.submitAnswers);
sessionRouter.route("/:share_code/results").get(sessionController.getResults);
sessionRouter.route("/:share_code/pdf").get(sessionController.generatePDF);
sessionRouter.route("/:share_code/checkout").post(sessionController.checkOut);
sessionRouter.route("/verify-payment").post(sessionController.verifyPayment);

module.exports = sessionRouter;

const { Router } = require("express");
const informationController = require("../controllers/infomation.controller");

const informationRouter = Router();

informationRouter.route("/").post(informationController.createInformation);

module.exports = informationRouter;

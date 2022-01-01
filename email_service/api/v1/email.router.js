const { Router } = require("express");
const emailcontroller = require("./email.controller");

const emailRouter = Router();
emailRouter.post("/sendEmail", emailcontroller.sendEmail);
emailRouter.post("/", emailcontroller.createEmailEntry);
emailRouter.delete("/:id", emailcontroller.deleteOnebyId);
emailRouter.post("/getBycode", emailcontroller.getOneByCode);

module.exports = emailRouter;

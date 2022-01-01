const { Router } = require("express");
const userRouter = require("./user.routes");
const { login } = require("../helpers/auth");
const router = Router();

router.use("/login", login);
router.use("/user", userRouter);

module.exports = router;

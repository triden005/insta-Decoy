const { Router } = require("express");
const userRouter = require("./user.routes");
const { login } = require("../helpers/auth");
const friendRouter = require("./friend.route");
const router = Router();

router.use("/login", login);
router.use("/user", userRouter);
router.use("/friend", friendRouter);

module.exports = router;

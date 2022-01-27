const { Router } = require("express");
const userRouter = require("./user.routes");
const { login } = require("../helpers/auth");
const friendRouter = require("./friend.route");
const postRouter = require("./posts.route");
const commentRouter = require("./comment.route");
const router = Router();

router.use("/login", login);
router.use("/user", userRouter);
router.use("/friend", friendRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);

module.exports = router;

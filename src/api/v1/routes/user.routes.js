const { Router } = require("express");
const Usercontroller = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

const userRouter = Router();

userRouter.post("/signup", Usercontroller.signup);
userRouter.get("/email_verify/:id", Usercontroller.verifyEmailLink);
userRouter
    .route("/")
    .get(Usercontroller.getUserProfile)
    .put(Usercontroller.updateCurrentUser);

userRouter.get("/:id", protect, Usercontroller.findUserByusername);
userRouter.post("/forgot_password", Usercontroller.forgotPassword);
userRouter.post("/update_password", Usercontroller.updatePassword);

userRouter.post("/search", protect, Usercontroller.searchUsers);
module.exports = userRouter;

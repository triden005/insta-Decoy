const { Router } = require("express");
const Usercontroller = require("../controllers/user.controller");
const Fileuploadcontroller = require("../controllers/fileupload.conroller");
const { protect } = require("../middlewares/auth.middleware");
const multermiddleware = require("../middlewares/multer.middleware");
const userRouter = Router();

userRouter.post("/signup", Usercontroller.signup);
userRouter.get("/email_verify/:id", Usercontroller.verifyEmailLink);
userRouter.post("/forgot_password", Usercontroller.forgotPassword);
userRouter.post("/update_password", Usercontroller.updateforgotPassword);

// Protected Route start
userRouter.use(protect);
userRouter
    .route("/")
    .get(Usercontroller.getUserProfile)
    .put(Usercontroller.updateCurrentUser);

userRouter.get("/:id", Usercontroller.findUserByusername);
userRouter.post("/search", Usercontroller.searchUsers);

userRouter.post(
    "/profilephoto",
    multermiddleware.single("profilephoto"),
    Fileuploadcontroller.uploadProfilePhoto,
);
module.exports = userRouter;

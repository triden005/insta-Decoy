const { Router } = require("express");
const Friendcontroller = require("../controllers/friend.controller");
const { protect } = require("../middlewares/auth.middleware");
const { Request } = require("../models/request.model");

const friendRouter = Router();
friendRouter.get("/db", async (req, res) => {
    const db = await Request.find({}).exec();
    res.json(db);
});
friendRouter.use(protect);
friendRouter
    .route("/")
    .get(Friendcontroller.getFriend)
    .post(Friendcontroller.getFriendRequest);
friendRouter.post("/sent", Friendcontroller.getSentFriendRequest);
friendRouter
    .route("/:username")
    .post(Friendcontroller.sendFriendRequest)
    .delete(Friendcontroller.deleteFriendRequest);

friendRouter.get("/accept/:id", Friendcontroller.acceptRequest);
friendRouter.get("/reject/:id", Friendcontroller.rejectRequest);

friendRouter.get("/unfriend/:username", Friendcontroller.unfriend);
friendRouter.get("/block/:username", Friendcontroller.blockUnblockUser);

module.exports = friendRouter;

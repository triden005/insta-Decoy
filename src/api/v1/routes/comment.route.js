const { Router } = require("express");

const { protect } = require("../middlewares/auth.middleware");
const commentController = require("../controllers/comment.controller");
const commentRouter = Router();

const { MODE } = require("../../../config");
const { Comment } = require("../models/comment.model");

// Protected Route start
commentRouter.use(protect);

commentRouter
    .route("/")
    .get(commentController.getCommentPaginated)
    .post(commentController.createOne)
    .patch(commentController.updateOne);

commentRouter.delete("/:id", commentController.deleteOne);
commentRouter.get("/like/:id", commentController.likeUnlikeComment);

commentRouter.get("/db", async (req, res) => {
    let db = [];
    if (MODE === "development") db = await Comment.find({}).exec();
    return res.json(db);
});

module.exports = commentRouter;

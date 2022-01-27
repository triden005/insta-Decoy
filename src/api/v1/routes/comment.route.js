const { Router } = require("express");

const { protect } = require("../middlewares/auth.middleware");
const { Comment } = require("../models/comment.model");
const commentController = require("../controllers/comment.controller");

const commentRouter = Router();

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
    let db = await Comment.find({}).exec();
    return res.json(db);
});

module.exports = commentRouter;

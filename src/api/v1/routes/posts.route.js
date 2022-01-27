const { Router } = require("express");
const {
    createOnePost,
    updatePosts,
} = require("../controllers/fileupload.conroller");
const multermiddleware = require("../middlewares/multer.middleware");

const { protect } = require("../middlewares/auth.middleware");
const { Posts } = require("../models/posts.model");
const postController = require("../controllers/posts.controller");

const postRouter = Router();

// Protected Route start
postRouter.use(protect);
//  Form data Formate
postRouter
    .route("/")
    .get(postController.getPosts)
    .post(multermiddleware.single("postphoto"), createOnePost)
    .patch(multermiddleware.single("postphoto"), updatePosts);

postRouter.post("/tag", postController.tagFriendOnPost);
postRouter.get("/feeds", postController.feeds);
postRouter.get("/like/:id", postController.likeUnlikePost);
postRouter
    .route("/bookmarks")
    .get(postController.getbookmarkposts)
    .post(postController.bookmarkPost);
postRouter.get("/db", async (req, res) => {
    let db = await Posts.find({}).exec();
    return res.json(db);
});
postRouter.delete("/:id", postController.deleteOne);
module.exports = postRouter;

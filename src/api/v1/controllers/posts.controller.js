const postService = require("../services/posts.service");

const { IdValidator } = require("../validators/user.validator");
exports.getPosts = async (req, res) => {
    try {
        let { pagenumber, pagesize } = req.query;
        pagenumber = parseInt(pagenumber);
        pagesize = parseInt(pagesize);
        if (
            !pagenumber ||
            !pagesize ||
            Number.isNaN(pagesize) ||
            Number.isNaN(pagenumber)
        ) {
            return res.status(404).json({
                message: "pagenumber,pagesize are required",
            });
        }
        const posts = await postService.getMyPosts(
            req.user._id,
            pagenumber,
            pagesize,
        );
        res.json(posts);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.tagFriendOnPost = async (req, res) => {
    try {
        const { users = [], postId } = req.body;
        if (!users || !users.length || !postId) {
            return res
                .status(400)
                .json({ message: "users array and postId is required" });
        }
        const { success } = await postService.tagFriends(
            users,
            postId,
            req.user,
        );
        if (!success) return res.status(400).json({ message: "bad request" });
        res.status(200).json({ message: `${success} friends tagged` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        if (!IdValidator(id))
            return res.status(404).json({ message: "not found" });

        const { deletedCount } = await postService.deleteOne(id, req.user);
        res.status(200).json({ message: `${deletedCount} post deleted` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.feeds = async (req, res) => {
    try {
        let { pagenumber, pagesize } = req.query;
        pagenumber = parseInt(pagenumber);
        pagesize = parseInt(pagesize);
        if (
            !pagenumber ||
            !pagesize ||
            Number.isNaN(pagesize) ||
            Number.isNaN(pagenumber)
        ) {
            return res.status(404).json({
                message: "pagenumber,pagesize are required",
            });
        }
        const posts = await postService.getFeeds(
            req.user._id,
            pagenumber,
            pagesize,
        );
        res.json(posts);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.likeUnlikePost = async (req, res) => {
    try {
        const { id } = req.params;
        if (!IdValidator(id))
            return res.status(400).json({ message: "invalid Route" });
        const { success, status } = await postService.likeUnlikePost(
            id,
            req.user,
        );
        if (!success)
            return res.status(400).json({ message: "something went wrong" });
        return res.json({ message: `like ${status} to the post` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.bookmarkPost = async (req, res) => {
    try {
        const { id } = req.body;
        if (!IdValidator(id))
            return res.status(400).json({ message: "id is required" });
        const { success, status } = await postService.bookmarkPost(
            id,
            req.user,
        );
        if (!success)
            return res.status(400).json({ message: "Post not found" });
        if (status) {
            res.json({ message: "bookmark added" });
        } else {
            res.json({ message: "bookmark removed" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.getbookmarkposts = async (req, res) => {
    try {
        let { pagenumber, pagesize } = req.query;
        pagenumber = parseInt(pagenumber);
        pagesize = parseInt(pagesize);
        if (
            !pagenumber ||
            !pagesize ||
            Number.isNaN(pagesize) ||
            Number.isNaN(pagenumber)
        ) {
            return res.status(404).json({
                message: "pagenumber,pagesize are required",
            });
        }
        const posts = await postService.getBookmarkedPostsPaginated(
            pagenumber,
            pagesize,
            req.user,
        );
        res.json(posts);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

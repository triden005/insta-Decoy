const commentService = require("../services/comment.service");
const { IdValidator } = require("../validators/user.validator");

exports.createOne = async (req, res) => {
    try {
        const { parentId, text, oncomment } = req.body;
        if (!IdValidator(parentId) || !text)
            return res
                .status(400)
                .json({ message: "parentId and text are required" });
        let comment;
        if (oncomment === true) {
            comment = await commentService.createReplyOnComment(
                text,
                parentId,
                req.user,
            );
        } else {
            comment = await commentService.createCommentOnPost(
                text,
                parentId,
                req.user,
            );
        }
        if (!comment) return res.status(400).json({ message: "bad Request" });
        res.status(201).json({ message: "Comment Created" });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

exports.updateOne = async (req, res) => {
    try {
        const { commentId, text } = req.body;
        if (!IdValidator(commentId) || !text)
            return res
                .status(400)
                .json({ message: "commentId and text are required" });

        const comment = await commentService.updateComment(
            text,
            commentId,
            req.user,
        );
        res.json(comment);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.deleteOne = async (req, res) => {
    try {
        const { id } = req.params;
        if (!IdValidator(id))
            return res.status(400).json({ message: "invalid Request" });
        const { deletedCount } = await commentService.deleteComment(
            id,
            req.user,
        );
        res.status(200).json({ message: `${deletedCount} comments deleted` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.likeUnlikeComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { success, status } = await commentService.likeUnlikeComment(
            id,
            req.user,
        );
        if (!success)
            return res.status(400).json({ message: "invalid request" });
        res.status(200).json({ message: `like ${status} to the comment` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.getCommentPaginated = async (req, res) => {
    try {
        let { pagenumber, pagesize, parentId } = req.query;
        pagenumber = parseInt(pagenumber);
        pagesize = parseInt(pagesize);
        if (
            !pagenumber ||
            !pagesize ||
            Number.isNaN(pagesize) ||
            Number.isNaN(pagenumber) ||
            !IdValidator(parentId)
        ) {
            return res.status(404).json({
                message: "pagenumber,pagesize and parentId are required",
            });
        }
        const comments = await commentService.getCommentPaginated(
            parentId,
            pagenumber,
            pagesize,
        );
        res.json(comments);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

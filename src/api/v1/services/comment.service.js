const {
    canCreateCommentOnPost,
    candeleteCommentOnPost,
    canUpdateAcommentOnPost,
} = require("../helpers/permissiondeterminer");
const { Comment } = require("../models/comment.model");
const { Posts } = require("../models/posts.model");
const { ObjectId } = require("mongoose").Types;

exports.getCommentPaginated = async (parentId, pagenumber, pagesize) => {
    const skip = (pagenumber - 1) * pagesize;

    const comments = await Comment.find({
        parent: ObjectId(parentId),
    })
        .skip(skip)
        .limit(pagesize)
        .populate({
            path: "creator",
            options: {
                select: {
                    name: 1,
                    username: 1,
                    profilepicture: 1,
                },
            },
        })
        .populate({
            path: "likedBy",
            options: {
                select: {
                    name: 1,
                },
                perDocumentLimit: 5,
            },
        })
        .exec();

    return comments;
};

exports.createCommentOnPost = async (text, parentId, user) => {
    const parentPost = await Posts.findById(parentId).exec();
    if (!parentPost) throw new Error("Invalid Post");

    //accessibilty logic which should be seperate
    if (!canCreateCommentOnPost(user, parentPost))
        throw new Error("Not accessible");
    const comment = await Comment.create({
        text,
        creator: user._id,
        creatorname: user.username,
        parent: parentPost.id,
        PostId: parentPost.id,
        likes: 0,
        likedBy: [],
        haveChild: false,
    });
    parentPost.comments.push(comment.id);
    await parentPost.save();
    return comment;
};

exports.createReplyOnComment = async (text, parentId, user) => {
    const parentComment = await Comment.findById(parentId)
        .populate("PostId")
        .exec();
    if (!parentComment) throw new Error("Invalid Post");

    //accessibilty logic which should be seperate
    if (!canCreateCommentOnPost(user, parentComment.PostId))
        throw new Error("Not accessible");
    const comment = await Comment.create({
        text,
        creator: user._id,
        creatorname: user.username,
        parent: parentComment._id,
        PostId: parentComment.PostId._id,
        likes: 0,
        likedBy: [],
        haveChild: false,
    });
    return comment;
};
/**
 *
 * @param {ObjectId} commentId
 * @param {ObjectId} PostId
 * @param {Object} user
 */
exports.deleteComment = async (commentId, user) => {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("invalid Request");
    const post = await Posts.findById(comment.PostId);
    if (!post) throw new Error("invalid Request");

    // accessibility logic which should be seperate
    if (!candeleteCommentOnPost(comment, post, user))
        throw new Error("Not accessible");

    //  means comment is having children
    if (comment.haveChild) {
        await Comment.deleteMany({ parent: post._id }).exec();
    }
    return await Comment.deleteOne({ _id: commentId });
};

exports.updateComment = async (text, commentId, user) => {
    const comment = await Comment.findById(commentId);

    //  accessibility logic
    if (!canUpdateAcommentOnPost(comment, user))
        throw new Error("Not accessible");

    comment.text = text;
    await comment.save();
    return comment;
};

exports.likeUnlikeComment = async (commentId, user) => {
    const comment = await Comment.findById(commentId);
    if (!comment) return { success: false };
    let status;
    if (
        comment.likedBy
            .map((each) => each.toString())
            .includes(user._id.toString())
    ) {
        status = "removed";
        comment.likedBy = comment.likedBy.filter(
            (each) => each.toString() !== user._id.toString(),
        );
        comment.likes -= 1;
    } else {
        status = "added";
        comment.likedBy.push(user._id);
        comment.likes += 1;
    }
    await comment.save();
    return { success: true, status };
};

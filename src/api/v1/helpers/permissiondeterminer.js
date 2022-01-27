const { MODE } = require("../../../config");

const DebugConsole = (...args) => {
    if (MODE === "development") {
        console.log(args);
    }
    return;
};

exports.canCreateCommentOnPost = (user, post) => {
    if (post.visibility === "public") return true;
    if (user.friends.includes(post.creator)) return true;

    DebugConsole(user.friends, post.creator);
    return false;
};

exports.candeleteCommentOnPost = (comment, Post, user) => {
    DebugConsole(comment, Post, user);
    if (comment.creator.toString() === user._id.toString()) return true;
    if (Post.creator.toString() === user._id.toString()) return true;

    return false;
};

exports.canUpdateAcommentOnPost = (comment, user) => {
    if (comment.creator.toString() === user._id.toString()) return true;
    DebugConsole(comment.creator, comment);
    return false;
};

/**
 *
 * @param {Object} post
 * @param {Object} user
 * @returns
 */
exports.canDeletePost = (post, user) => {
    DebugConsole(post.creator, user);
    if (post.creator.toString() === user._id.toString()) return true;
    return false;
};

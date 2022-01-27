const { Posts } = require("../models/posts.model");
const { Comment } = require("../models/comment.model");
const { User } = require("../models/user.model");
const { canDeletePost } = require("../helpers/permissiondeterminer");
const { ObjectId } = require("mongoose").Types;

exports.findOneById = async (id) => {
    return await Posts.findById(id);
};

exports.createOne = async (caption, picture, visibility, tags, creatorId) => {
    return await Posts.create({
        caption,
        picture,
        visibility,
        likes: 0,
        likedBy: [],
        tags: [...tags],
        taggedUser: [],
        creator: creatorId,
    });
};

exports.updateOne = async (postId, update, user) => {
    return await Posts.updateOne(
        {
            _id: postId,
            creator: user._id,
        },
        update,
    ).exec();
};

exports.deleteOne = async (PostId, user) => {
    const post = await Posts.findById(PostId);
    if (!post) throw new Error("invalid request");

    //  accessibility logic which should be seperate
    if (!canDeletePost(post, user)) throw new Error("invalid Opertion");
    Comment.deleteMany({ PostId })
        .exec()
        .then((e) => {
            console.log(e);
        });
    return await Posts.deleteOne({
        _id: PostId,
    }).exec();
};

exports.tagFriends = async (users, postId, user) => {
    const post = await Posts.findById(postId);
    if (!post) return { success: false };
    if (post.creator.toString() !== user._id.toString())
        return { success: false };
    users = users.map((each) => {
        try {
            return ObjectId(each);
        } catch (e) {}
    });
    const usersarray = await User.aggregate([
        {
            $match: {
                $and: [{ _id: { $in: users } }, { _id: { $in: user.friends } }],
            },
        },
    ]);
    usersarray.forEach((each) => {
        post.taggedUser.push(each._id);
    });
    await post.save();
    console.log(usersarray);
    return { success: usersarray.length };
};
exports.getMyPosts = async (userId, pagenumber, pagesize) => {
    const skip = (pagenumber - 1) * pagesize;
    const posts = await Posts.find({
        creator: userId,
    })
        .sort({
            createdAt: 1,
        })
        .skip(skip)
        .limit(pagesize)
        .populate({
            path: "comments",
            options: { perDocumentLimit: 5 },
            select: {
                text: 1,
                creatorname: 1,
                PostId: 1,
                likes: 1,
                haveChild: 1,
            },
        });
    return posts;
};

exports.getFeeds = async (userId, pagenumber, pagesize) => {
    const skip = (pagenumber - 1) * pagesize;
    const user = await User.findOne(
        {
            _id: userId,
        },
        "+blockedBy",
    ).exec();

    const ignore = [];
    for (let i = 0; i < user.blockedBy.length; i += 1) {
        ignore.push(new ObjectId(user.blockedBy[i]));
    }
    for (let i = 0; i < user.blockedUsers.length; i += 1) {
        ignore.push(new ObjectId(user.blockedUsers[i]));
    }
    // TODO: remove comment in the line below
    // ignore.push(user._id);
    const posts = await Posts.find({
        creator: { $nin: ignore },
    })
        .sort({
            createdAt: 1,
        })
        .skip(skip)
        .limit(pagesize)
        .populate({
            path: "comments",
            options: { perDocumentLimit: 5 },
            select: {
                text: 1,
                creatorname: 1,
                PostId: 1,
                likes: 1,
                haveChild: 1,
            },
        });
    return posts;
};

exports.likeUnlikePost = async (PostId, user) => {
    const post = await Posts.findById(PostId);
    if (!post) return { success: false };
    let status;
    if (
        post.likedBy
            .map((each) => each.toString())
            .includes(user._id.toString())
    ) {
        status = "removed";
        post.likedBy = post.likedBy.filter(
            (each) => each.toString() !== user._id.toString(),
        );
        post.likes -= 1;
    } else {
        status = "added";
        post.likedBy.push(user._id);
        post.likes += 1;
    }
    await post.save();
    return { success: true, status };
};

exports.getBookmarkedPostsPaginated = async (pagenumber, pagesize, user) => {
    const skip = (pagenumber - 1) * pagesize;
    const posts = await Posts.find({
        _id: { $in: user.bookmarkedPosts },
    })
        .sort({
            createdAt: 1,
        })
        .skip(skip)
        .limit(pagesize)
        .populate({
            path: "comments",
            options: { perDocumentLimit: 5 },
            select: {
                text: 1,
                creatorname: 1,
                PostId: 1,
                likes: 1,
                haveChild: 1,
            },
        });
    return posts;
};

exports.bookmarkPost = async (postId, leanuser) => {
    const post = await Posts.findById(postId);
    if (!post) return { success: false };
    const user = await User.findById(leanuser._id);
    let status = false;
    if (user.bookmarkedPosts.map((each) => each.toString()).includes(post.id)) {
        status = false;
        user.bookmarkedPosts = user.bookmarkedPosts.filter(
            (each) => each.toString() !== post.id.toString(),
        );
    } else {
        status = true;
        user.bookmarkedPosts.push(post.id);
    }
    await user.save();
    return { success: true, status };
};

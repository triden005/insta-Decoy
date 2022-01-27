const fs = require("fs");
const { uploader } = require("../helpers/cloudinary");
const UserService = require("../services/user.services");
const postService = require("../services/posts.service");
const { IdValidator } = require("../validators/user.validator");
exports.uploadProfilePhoto = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res
                .status(400)
                .json({ message: "profilephoto is required" });
        }
        const { path: filepath } = file;
        const { secure_url } = await uploader(filepath, "profilephoto");
        if (!secure_url) throw new Error("uploading failed");
        await UserService.findOneAndUpdate(
            { _id: req.user._id },
            { profilePhoto: secure_url },
        );
        fs.unlinkSync(filepath);
        return res.status(200).send();
    } catch (e) {
        res.status(500).json({ message: "Failed to upload the file" });
    }
};

exports.createOnePost = async (req, res) => {
    try {
        const { caption, visibility = "public", tags = [] } = req.body;
        if (!caption)
            return res.status(400).json({
                message:
                    "caption is required. Please send data in form data format",
            });
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message:
                    "PostPhoto is required. Please send data in form data format",
            });
        }
        const { path: filepath } = file;
        const { secure_url } = await uploader(filepath, "postphoto");
        if (!secure_url) throw new Error("uploading failed");
        fs.unlinkSync(filepath);
        const post = await postService.createOne(
            caption,
            secure_url,
            visibility,
            tags,
            req.user._id,
        );

        if (!post)
            return res.status(400).json({ message: "something Bad happened!" });
        return res.status(201).json({ message: "post created successfully" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.updatePosts = async (req, res) => {
    try {
        const { visibility, caption, tags, postId } = req.body;
        if (!postId || !IdValidator(postId))
            return res.status(400).json({ message: "postId is required" });
        const update = {};
        if (visibility) update.visibility = visibility;
        if (caption) update.caption = caption;
        if (tags) update.tags = tags;
        const file = req.file;
        if (file) {
            const { path: filepath } = file;
            const { secure_url } = await uploader(filepath, "postphoto");
            if (!secure_url) throw new Error("uploading failed");
            fs.unlinkSync(filepath);
            update.picture = secure_url;
        }
        const { modifiedCount } = await postService.updateOne(
            postId,
            update,
            req.user,
        );
        if (!modifiedCount)
            return res.status(400).json({ message: "invalid request" });
        res.json({ message: "updated the post" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

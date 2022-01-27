const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
    {
        caption: String,
        picture: String,
        creator: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            immutable: true,
        },
        comments: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "comment",
            },
        ],
        visibility: {
            type: String,
            enum: ["public", "private"],
        },
        likes: Number,
        likedBy: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "user",
            },
        ],
        tags: [{ type: String }],
        taggedUser: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "user",
            },
        ],
    },
    {
        timestamps: true,
    },
);
module.exports.Posts = mongoose.model("post", postsSchema);

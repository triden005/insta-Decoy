const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        text: String,
        creator: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            immutable: true,
        },
        creatorname: String,
        parent: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "comment",
            immutable: true,
        },
        PostId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "post",
            immutable: true,
        },
        likes: Number,
        likedBy: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "user",
            },
        ],
        haveChild: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
);
module.exports.Comment = mongoose.model("comment", commentSchema);

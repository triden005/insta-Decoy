const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: URL,
        },
        phoneNumber: {
            type: Number,
        },
        blockedUsers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
        blockedBy: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
        friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
        Posts: [{ types: String }],
        profileStatus: {
            type: String,
            enum: ["public", "private"],
            default: "private",
        },
        Notification: {
            type: Boolean,
            default: false,
        },
        verifiedUser: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports.User = mongoose.model("user", userSchema);

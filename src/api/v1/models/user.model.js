const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
            select: false,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        profilePhoto: {
            type: String,
        },
        phoneNumber: {
            type: Number,
        },
        blockedUsers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
        blockedBy: {
            type: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
            select: false,
        },
        friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: "user" }],
        Posts: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "posts",
            },
        ],
        profileStatus: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        notification: {
            type: Boolean,
            default: false,
        },
        verifiedUser: {
            type: Boolean,
            default: false,
        },
        bookmarkedPosts: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "posts",
            },
        ],
    },
    { timestamps: true },
);

userSchema.pre("validate", function (next) {
    console.log(this.isModified("passwordHash"));
    if (!this.isModified("passwordHash")) {
        return next();
    }
    bcrypt.hash(this.passwordHash, 8, (err, hash) => {
        if (err) {
            return next(err);
        }
        this.passwordHash = hash;
        next();
    });
});

userSchema.methods.checkPassword = function (password) {
    const passwordHash = this.passwordHash;
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                return reject(err);
            }
            resolve(same);
        });
    });
};

module.exports.User = mongoose.model("user", userSchema);

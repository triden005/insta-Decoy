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
            default: "public",
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

userSchema.pre("save", function (next) {
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

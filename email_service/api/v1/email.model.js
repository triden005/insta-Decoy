const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
    {
        eventparam: {
            type: String,
            unique: true,
            required: true,
        },
        eventName: {
            type: String,
            enum: ["activationemail"],
            required: true,
        },
        associatedUser: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { timestamps: true },
);

module.exports.Email = mongoose.model("email", emailSchema);

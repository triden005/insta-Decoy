const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
    {
        eventurl: {
            type: String,
            unique: true,
            required: true,
        },
        eventName: {
            type: String,
            enum: ["activationemail"],
            required: true,
        },
        associatedUsers: { type: mongoose.SchemaTypes.ObjectId, ref: "user" },
    },
    { timestamps: true },
);

module.exports.Email = mongoose.model("email", emailSchema);

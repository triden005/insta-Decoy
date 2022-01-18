const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        emitter: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            required: true,
        },
        receiver: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            required: true,
        },
        type: {
            type: String,
            enum: ["friend", "follow"],
        },
        active: {
            type: Boolean,
        },
    },
    { timestamps: true },
);

module.exports.Request = mongoose.model("request", requestSchema);

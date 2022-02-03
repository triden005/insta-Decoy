const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema(
    {
        tagname: String,
        tagpower: Number,
    },
    {
        timestamps: true,
    },
);

module.exports.Tags = mongoose.model("tags", tagsSchema);

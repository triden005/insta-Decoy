const mongoose = require("mongoose"),
    { DBURL } = require("../../../config");

const connect = (url = DBURL, opts = {}) => {
    return mongoose.connect(url, { ...opts, useNewUrlParser: true });
};

module.exports.connect = connect;

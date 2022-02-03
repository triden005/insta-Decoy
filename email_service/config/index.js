require("dotenv").config();

const config = {
    MODE: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 4000,

    EMAIL: process.env.EMAIL,
    EMAILKEY: process.env.EMAILKEY,
    EMAILTRANSPORTER: process.env.EMAILTRANSPORTER,
    SERVICETOKEN: process.env.SERVICETOKEN,

    MAINSERVICEBASEURL:
        process.env.MAINSERVICEBASEURL || "http://localhost:3000",
    DBURL: process.env.MONGODBURL,
};

module.exports = config;

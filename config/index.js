require("dotenv").config();

const config = {
    env: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    EMAIL: process.env.EMAIL,
    SECRET: process.env.EMAILPASSWORD,
    EMAILSERVICE: process.env.EMAILSERVICE,

    JWTSECRET: process.env.JWTSECRET || "secret",
    JWTEXP: "5d",

    DBURL: process.env.MONGODBURL,
};

module.exports = config;

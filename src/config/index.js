require("dotenv").config();

const config = {
    MODE: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    EMAIL: process.env.EMAIL,
    SECRET: process.env.EMAILPASSWORD,
    EMAILSERVICE: process.env.EMAILSERVICE,

    JWTSECRET: process.env.JWTSECRET || "secret",
    JWTEXP: "5d",

    DBURL: process.env.MONGODBURL,
    EMAILSERVICEBASEURL:
        process.env.EMAILSERVICEBASEURL || `http://localhost:4000`,

    // File upload

    CLOUDAPIKEY: process.env.CLOUDAPIKEY,
    CLOUDNAME: process.env.CLOUDNAME,
    CLOUDAPISECRET: process.env.CLOUDAPISECRET,
};

module.exports = config;

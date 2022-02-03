require("dotenv").config();

const config = {
    MODE: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,

    JWTSECRET: process.env.JWTSECRET || "secret",
    JWTEXP: "5d",

    EMAILSERVICEBASEURL:
        process.env.EMAILSERVICEBASEURL || `http://localhost:4000`,
    SERVICETOKEN: process.env.SERVICETOKEN,

    DBURL: process.env.MONGODBURL,

    // File upload
    CLOUDAPIKEY: process.env.CLOUDAPIKEY,
    CLOUDNAME: process.env.CLOUDNAME,
    CLOUDAPISECRET: process.env.CLOUDAPISECRET,
};

module.exports = config;

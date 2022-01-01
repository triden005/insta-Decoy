const validator = require("validator");
const { isValidObjectId } = require("mongoose");
const { validate } = require("uuid");
exports.emailvalidator = (email) => {
    try {
        return validator.isEmail(email);
    } catch (e) {
        return false;
    }
};

exports.IDvalidator = (id) => {
    try {
        return isValidObjectId(id) && validator.isMongoId(id);
    } catch (e) {
        return false;
    }
};

exports.eventvalidator = (eventName) => {
    if (eventName === "activationemail") {
        return true;
    }
    return false;
};

exports.emailCodeValidator = (param) => {
    if (validate(param)) return true;
    return false;
};

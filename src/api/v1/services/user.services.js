const { User } = require("../models/user.model");
const fetchService = require("./fetch.service");
const { PORT } = require("../../../config");
/**
 * Find user by email
 * @param {string} email The Email to find
 * @returns User Object
 */
async function findOneByEmail(email) {
    return await User.findOne({ email }).exec();
}
/**
 * Find user by email
 * @param {string} email The Email to find
 * @returns User Object
 */
async function findOneByUsername(username) {
    return await User.findOne({ username }).exec();
}

/**
 * @param {string} username
 * @param {email} email
 * @returns User matching either email or username
 */
async function findOnebyEmailorUsername(username, email) {
    return await User.findOne({ $or: [{ email }, { username }] }).exec();
}

/**
 *
 * @param {ObjectId} id
 * @returns User|null
 */
async function findOneById(id) {
    return await User.findById(id).lean().exec();
}

/**
 *
 * @param {Object} user
 * @returns User
 */
async function createOne(user) {
    const doc = new User(user);
    await doc.save();
    return doc;
}
/**
 * @param {Object} filter
 * @param {Object} update
 * @returns
 */
async function findOneAndUpdate(filter, update) {
    let doc = await User.findOneAndUpdate(filter, update, {
        new: true,
    });
    return doc;
}
/**
 * For updating user all the data validation should be done prior
 * @param {ObjectId} id
 * @param {object} data
 * @returns User
 */
async function findByIdAndUpdate(id, data) {
    let doc = await User.findByIdAndUpdate(id, data, {
        new: true,
    }).exec();
    return doc;
}
/**
 * Searches public users in the provided filter
 * @param {string} searchBy username|email|name
 * @param {string} searchValue
 * @param {Array[ObjectId]} ignoreList
 * @param {number} limit
 * @returns Array[User]
 */
async function search(searchBy, searchValue, ignoreList, limit) {
    const allowedSearches = ["username", "email", "name"];
    let filter = {};
    if (allowedSearches.includes(searchBy)) {
        filter = {
            [searchBy]: { $regex: searchValue, $options: "i" },
            _id: { $nin: ignoreList },
            profileStatus: { $ne: "private" },
            verifiedUser: { $ne: "false" },
        };
        const results = await User.find(filter)
            .limit(limit || 100)
            .select("email username name")
            .exec();
        return results;
    }
    return [];
}
/**
 * changes verifeidUser from false to true
 * @param {Object} id
 * @returns boolean
 */
async function changeAccountStateVerified(id) {
    let doc = await User.findById(id).exec();
    if (!doc) {
        throw new Error("Record not Found");
    }
    doc.verifiedUser = true;
    await doc.save();
    return true;
}
/**
 * creates async email entry for
 * @param {string} email
 * @param {string} eventName verificationemail|forgotpasswordemail
 * @param {ObjectId} userId
 * @param {string} username
 * @param {string} name
 * @returns string|false
 */
async function createVerificationEmailEntry(
    email,
    eventName,
    userId,
    username,
    name,
) {
    try {
        let res = await fetchService.createEmailEntryRequest(
            email,
            eventName,
            userId,
            username,
            name,
        );
        if (res.success && res.data.verificationCode) {
            return res.data.verificationCode;
        }
        return false;
    } catch (e) {
        return false;
    }
}

/**
 *  Sends synchronously the verificationEmail
 * @deprecated
 * @param {string} email
 * @param {string} username
 * @param {string} code verification code to be sent
 * @returns {boolean}
 */
async function sendVerificationEmail(email, username, code) {
    try {
        let message = `
        You are just one step behind to activate your account and get most out of it 
        Please click the link below to confirm your account creation with username ${username}
        http://localhost:${PORT}/api/v1/users/${code}
        `;
        let res = await fetchService.sendEmailrequest(
            email,
            "Verification Link for Account",
            message,
        );
        if (res.success && res.data.verificationCode) {
            return res;
        }
        return false;
    } catch (e) {
        return false;
    }
}
module.exports = {
    findOneById,
    findOneByEmail,
    findOneByUsername,
    findOnebyEmailorUsername,
    findOneAndUpdate,
    createOne,
    findByIdAndUpdate,
    search,
    changeAccountStateVerified,
    createVerificationEmailEntry,
    sendVerificationEmail,
};

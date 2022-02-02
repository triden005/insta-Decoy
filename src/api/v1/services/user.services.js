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
 * Creates one User
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
 * @deprecated Service moved to emailservice microservice
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
/**
 * gets all friends by Object Id array
 * @param {ObjectId[]} ids
 * @returns User { username, name, email, profilePhoto }
 */
async function getAllFriendsbyid(ids) {
    return await User.find({ _id: { $in: ids } })
        .select("username name email profilePhoto")
        .exec();
}

/**
 * addes respective ids to each others friends field
 * @param {ObjectId} user1ID
 * @param {ObjectId} user2ID
 * @returns boolean
 */
async function makeFriends(user1ID, user2ID) {
    try {
        const users = await User.find({
            _id: { $in: [user1ID, user2ID] },
        }).exec();

        const [u1, u2] = users;
        if (
            users.length < 2 ||
            u1.blockedUsers.map((each) => each.toString()).includes(u2.id) ||
            u2.blockedUsers.map((each) => each.toString()).includes(u1.id)
        )
            return false;
        u1.friends.push(u2._id);
        u2.friends.push(u1._id);
        if (u2.notification) {
            fetchService.sendnotification(
                u2.email,
                "notificationacceptedrequest",
                u1.username,
                u2.name,
            );
        }
        await Promise.all([u1.save(), u2.save()]);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Unfriends Users ie Filters out ids from corresponding users
 * @param {ObjectId} user1ID
 * @param {ObjectId} user2ID
 * @returns
 */
async function unfriend(user1ID, user2ID) {
    try {
        const users = await User.find({ _id: { $in: [user1ID, user2ID] } });
        if (users.length < 2) return false;
        const [u1, u2] = users;
        u1.friends = u1.friends.filter((each) => !u2._id.equals(each));
        u2.friends = u2.friends.filter((each) => !u1._id.equals(each));
        await Promise.all([u1.save(), u2.save()]);
        return true;
    } catch (_) {
        return false;
    }
}
/**
 * Blocks or unblocks user depending upon the prevState
 * @param {ObjectId} userId
 * @param {String} username
 * @returns Status (blocked|unblocked)
 */
async function blockUnblockUser(userId, username) {
    let status;
    const [user, person] = await Promise.all([
        User.findById(userId).exec(),
        User.findOne({ username }).select("+blockedBy").exec(),
    ]);
    if (!person || person.id === user.id) throw new Error("bad Request");

    if (user.blockedUsers.map((each) => each.toString()).includes(person.id)) {
        status = "unblocked";
        user.blockedUsers = user.blockedUsers.filter(
            (each) => !each.equals(person._id),
        );
        person.blockedBy = person.blockedBy.filter(
            (each) => !each.equals(user._id),
        );
    } else {
        status = "blocked";
        user.blockedUsers.push(person._id);
        person.blockedBy.push(user._id);

        // means they were friend and blocked each other : Generally happens :-)
        if (user.friends.map((each) => each.toString()).includes(person.id)) {
            user.friends = user.friends.filter(
                (each) => !each.equals(person._id),
            );
            person.friends = person.friends.filter(
                (each) => !each.equals(user._id),
            );
        }
    }
    await Promise.all[(user.save(), person.save())];
    return status;
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
    makeFriends,
    unfriend,
    getAllFriendsbyid,
    blockUnblockUser,
};

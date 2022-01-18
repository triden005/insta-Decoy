const RequestService = require("../services/request.service");
const UserService = require("../services/user.services");
const {
    usernameValidator,
    IdValidator,
} = require("../validators/user.validator");

exports.getFriend = async (req, res) => {
    try {
        const { friends: Ids } = req.user;
        const friends = await UserService.getAllFriendsbyid(Ids);

        res.status(200).json(friends);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.getFriendRequest = async (req, res) => {
    try {
        const { pagenumber, pagesize } = req.body;
        if (
            !pagenumber ||
            !pagesize ||
            Number.isNaN(pagesize) ||
            Number.isNaN(pagenumber)
        ) {
            return res
                .status(404)
                .json({ message: "pagenumber and pagesize is required" });
        }
        const requests = await RequestService.findreceivedbyTypePaginated(
            req.user._id,
            "friendrequest",
            pagenumber,
            pagesize,
        );
        res.status(200).json(requests);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.getSentFriendRequest = async (req, res) => {
    try {
        const { pagenumber, pagesize } = req.body;
        if (
            !pagenumber ||
            !pagesize ||
            Number.isNaN(pagesize) ||
            Number.isNaN(pagenumber)
        ) {
            return res
                .status(404)
                .json({ message: "pagenumber and pagesize is required" });
        }
        const requests = await RequestService.findEmittedbyTypePaginated(
            req.user._id,
            "friendrequest",
            pagenumber,
            pagesize,
        );
        res.status(200).json(requests);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.sendFriendRequest = async (req, res) => {
    try {
        const { username } = req.params;
        if (!usernameValidator(username)) {
            return res.status(404).json({ message: "route not found" });
        }
        const user = await UserService.findOneByUsername(username);
        if (
            req.user.friends
                .map((user) => user.toString())
                .includes(user._id.toString())
        ) {
            return res.status(400).json({ message: "Already friends" });
        }

        if (
            req.user.blockedUsers
                .map((user) => user.toString())
                .includes(user._id.toString())
        ) {
            return res
                .status(400)
                .json({ message: "Please Unblock the user first" });
        }

        await RequestService.createOne(req.user._id, user.id, "friendrequest");
        res.status(201).json({ message: "friend Request Sent" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.deleteFriendRequest = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await UserService.findOneByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "route not found" });
        }
        const { deletedCount } = await RequestService.deleteOne(
            req.user._id,
            user._id,
            "friendrequest",
        );
        if (deletedCount)
            return res.status(200).json({ message: "friend Request Deleted" });
        res.status(404).json({ message: "Not found" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.acceptRequest = async (req, res) => {
    try {
        const { id } = req.params;
        if (!IdValidator(id)) {
            return res.status(404).json({ message: "invalid request" });
        }
        const request = await RequestService.findOneById(id);
        if (
            request &&
            request.active &&
            request.type === "friendrequest" &&
            request.receiver.equals(req.user._id)
        ) {
            const done = await UserService.makeFriends(
                request.emitter,
                request.receiver,
            );
            if (!done)
                return res.status(400).json({
                    message:
                        "make sure user is valid and you have not blocked him",
                });
            await RequestService.expireOne(id, req.user._id);
            res.status(200).send();
        } else {
            res.status(400).json({ message: "bad Request" });
        }
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        if (!IdValidator(id)) {
            return res.status(404).json({ message: "invalid request" });
        }
        const { modifiedCount } = await RequestService.expireOne(
            id,
            req.user._id,
        );
        if (!modifiedCount)
            return res.status(404).json({ message: "invalid Request" });
        res.status(200).json({ message: "Done" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

/**
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.unfriend = async (req, res) => {
    try {
        const { username } = req.params;
        if (!usernameValidator(username)) {
            return res.status(404).json({ message: "invalid username" });
        }
        const user = await UserService.findOneByUsername(username);
        if (!user) {
            return res.status(404).json({ message: "invalid username" });
        }
        const request = await UserService.unfriend(user.id, req.user._id);
        if (!request)
            return res.status(404).json({ message: "invalid Request" });
        res.status(200).json({
            message: `${username} removed from friendlist sucessfully`,
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.blockUnblockUser = async (req, res) => {
    try {
        const { username } = req.params;
        if (!usernameValidator(username))
            return res.status(404).json({ message: "Invalid Route" });
        const status = await UserService.blockUnblockUser(
            req.user._id,
            username,
        );
        res.status(200).json({ message: `username ${username} is ${status}` });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

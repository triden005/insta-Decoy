const FetchService = require("../services/fetch.service");
const UserService = require("../services/user.services");
const {
    emailValidator,
    passwordValidator,
    usernameValidator,
    verificationCodeValidator,
} = require("../validators/user.validator");

exports.signup = async (req, res) => {
    try {
        const { email, password, username, name, ...rest } = req.body;
        if (!name) {
            return res.status(400).send({ message: "Name is Required" });
        }
        if (!emailValidator(email)) {
            return res.status(400).send({ message: "Invalid Email" });
        }

        if (!usernameValidator(username)) {
            return res.status(400).send({
                message: "username should have a length of 8 atleast",
            });
        }
        if (!passwordValidator(password))
            return res.status(400).send({
                message:
                    "Weak password try a combination of numbers/symbols and a good length",
            });

        let user = await UserService.findOnebyEmailorUsername(username, email);
        if (user) {
            if (user.email === email && user.verifiedUser === true) {
                return res.status(400).send({
                    message:
                        "Email already Exists Please proceed to forgot password!",
                });
            } else if (user.email === email) {
                user = await UserService.findOneAndUpdate(
                    { email },
                    {
                        username,
                        email,
                        name,
                        ...rest,
                        passwordHash: password,
                        verifiedUser: false,
                    },
                );
            } else if (user.username === username) {
                return res.status(400).send({
                    message: "User Name already Exists !!",
                });
            }
        }
        if (!user)
            user = await UserService.createOne({
                username,
                email,
                name,
                ...rest,
                passwordHash: password,
                verifiedUser: false,
            });

        if (!user) {
            return res.status(400).send({
                message: "username already Exists",
            });
        }

        UserService.createVerificationEmailEntry(
            email,
            "verificationemail",
            user.id,
            username,
            name,
        );

        return res.status(201).send({
            message:
                "We just sent an email to your account. Confirm your mail to login",
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
exports.verifyEmailLink = async (req, res) => {
    try {
        let { id } = req.params;
        if (!verificationCodeValidator(id)) {
            return res.status(404).send();
        }
        let doc = await FetchService.getEmailEntryBycodeRequest(id);
        if (!doc || !doc.success) return res.status(404).send();

        if (doc.data.eventName === "verificationemail") {
            await UserService.changeAccountStateVerified(
                doc.data.associatedUser,
            );
            return res.status(202).json({ message: "User is now verified" });
        }
        return res.status(404).send();
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
exports.searchUsers = async (req, res) => {
    const { searchBy, searchValue, limit } = req.body;
    if (!searchBy || !searchValue) {
        return res
            .status(404)
            .json({ message: "searchBy and searchValue are required" });
    }
    const ignoreList = req.user.blockedBy;
    try {
        const results = await UserService.search(
            searchBy,
            searchValue,
            ignoreList,
            limit,
        );
        res.status(200).json(results);
    } catch (e) {
        return res.status(500).json([]);
    }
};
exports.findUserByusername = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send();
        const record = await UserService.findOneByUsername(id);
        if (!record || record.blockedUsers.includes(req.user.id))
            return res.status(404).json({});
        return res.status(200).json({
            ...record._doc,
            blockedUsers: [],
            blockedBy: [],
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.updateCurrentUser = async (req, res) => {
    try {
        const update = {};
        [
            "username",
            "name",
            "password",
            "phoneNumber",
            "profileStatus",
            "Notification",
        ].forEach((element) => {
            if (req.body[element]) {
                update[element] = req.body[element];
            }
        });
        await UserService.findByIdAndUpdate(req.user._id, update);

        return res.status(204).send();
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !emailValidator(email))
            return res.status(404).json({ message: "Invalid Email" });
        const user = await UserService.findOneByEmail(email);
        if (!user)
            return res
                .status(404)
                .json({ message: "No user found for this Email" });

        UserService.createVerificationEmailEntry(
            email,
            "forgotpasswordemail",
            user.id,
            user.username,
            user.name,
        );
        return res.status(200).json({
            message: `An email will be send to your mail with the verification code which must be send to updatepassword route`,
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
exports.updateforgotPassword = async (req, res) => {
    try {
        const { code, password } = req.body;
        if (!verificationCodeValidator(code)) {
            return res.status(400).json({ message: "invalid Code" });
        }
        if (!passwordValidator(password)) {
            return res.status(400).json({ message: "Weak Password Sent" });
        }

        const doc = await FetchService.getEmailEntryBycodeRequest(code);
        if (doc && doc.success) {
            if (doc.data.eventName === "forgotpasswordemail") {
                const id = doc.data.associatedUser;
                const user = await UserService.findByIdAndUpdate(id, {
                    password,
                });
                if (user) {
                    return res.status(202).end();
                }
            }
        }
        return res.status(404).json({ message: "Code Expired" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
exports.getUserProfile = async (req, res) => {
    return res.json(req.user);
};

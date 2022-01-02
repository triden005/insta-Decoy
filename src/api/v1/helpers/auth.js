const { JWTSECRET, JWTEXP } = require("../../../config");
const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.newToken = (user) => {
    return jwt.sign(
        { id: user.id, varifiedUser: user.verifiedUser },
        JWTSECRET,
        {
            expiresIn: JWTEXP,
        },
    );
};

exports.verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, JWTSECRET, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        });
    });

exports.login = async (req, res) => {
    const { password, username, email } = req.body;
    if (!password) {
        return res.status(400).send({ message: "password is required" });
    }
    if (!username && !email) {
        return res
            .status(400)
            .send({ message: "Either Email or Password is required" });
    }

    const invalid = { message: "Invalid  Credentials" };

    try {
        let filter = {};
        if (username) {
            filter = { username };
        } else {
            filter = { email };
        }
        const user = await User.findOne(filter)
            .select("email verifiedUser passwordHash")
            .exec();
        if (!user) {
            return res.status(401).send(invalid);
        }
        const match = await user.checkPassword(password);

        if (!match) {
            return res.status(401).send(invalid);
        }
        const token = this.newToken(user);
        return res.status(201).send({ token });
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
};

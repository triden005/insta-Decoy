const { verifyToken } = require("../helpers/auth");
const UserService = require("../services/user.services");
const { tokenValidator } = require("../validators/user.validator");
/**
 * Middleware to protect routes
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns
 */
exports.protect = async (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith("Bearer ")) {
        return res.status(401).end();
    }

    const token = bearer.split("Bearer ")[1].trim();
    if (!tokenValidator(token)) return res.status(401).end();
    let payload;
    try {
        payload = await verifyToken(token);
    } catch (e) {
        return res.status(401).end();
    }

    const user = await UserService.getOneById(payload.id);

    if (!user) {
        return res.status(401).end();
    }

    req.user = user;
    next();
};

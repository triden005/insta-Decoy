const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

/**
 * File Filter for Multer
 * @param {Express.Request} req
 * @param {Express.Multer.File} file
 * @param {Function} cb
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else cb({ message: "Unsupported File Format" }, false);
};

/**
 * Multer Uploader
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;

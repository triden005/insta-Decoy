const cloudinary = require("cloudinary").v2;
const { CLOUDAPIKEY, CLOUDNAME, CLOUDAPISECRET } = require("../../../config");

cloudinary.config({
    cloud_name: CLOUDNAME,
    api_key: CLOUDAPIKEY,
    api_secret: CLOUDAPISECRET,
});
/**
 * Cloudinary File uploading service
 * @param {string} file
 * @param {string} folder
 * @returns
 */
exports.uploader = (file, folder) => {
    return new Promise((resolve, reject) => {
        try {
            cloudinary.uploader
                .upload(file, { folder: folder, resource_type: "auto" })
                .then((result) => {
                    console.log(result);
                    resolve(result);
                });
        } catch (error) {
            reject(error);
        }
    });
};

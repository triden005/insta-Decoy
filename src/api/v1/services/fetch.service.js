const axios = require("axios");
const { EMAILSERVICEBASEURL } = require("../../../config");
/**
 @typedef fetchObject
 @type {Object}
 @property {boolean} success 
 @property {number} status The status Code
 @property {any} data
 */

/**
 *
 * @param {email} to The email which mail has to be sent
 * @param {string} subject
 * @param {string} text
 * @returns {fetchObject}
 */
exports.sendEmailrequest = async (to, subject, text) => {
    try {
        let config = {
            method: "post",
            url: `${EMAILSERVICEBASEURL}/send_email`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                to,
                subject,
                text,
            },
        };
        let res = await axios(config);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};

/**
 * Requests to create an Email entry to email service
 * @param {string} email
 * @param {string} eventName verificationmail | forgotpasswordmail
 * @param {ObjectId} userId
 * @param {string} username
 * @param {string} name
 * @returns {fetchObject}
 */
exports.createEmailEntryRequest = async (
    email,
    eventName,
    userId,
    username,
    name,
) => {
    try {
        let config = {
            method: "post",
            url: `${EMAILSERVICEBASEURL}/`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                email,
                eventName,
                userId,
                username,
                name,
            },
        };

        let res = await axios(config);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};
/**
 * Deletes the email record synchronously by providing id from email service
 * @param {string} emailId The id of email record to be deleted
 * @returns {fetchObject}
 * @deprecated slows the thread
 */
exports.deleteEmailEntryRequest = async (emailId) => {
    try {
        let config = {
            method: "delete",
            url: `${EMAILSERVICEBASEURL}/${emailId}`,
        };

        let res = await axios(config);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};
/**
 * Gets the email Object from email service
 * @param {string} code The code which will be sent in a email
 * @returns {fetchObject}
 */
exports.getEmailEntryBycodeRequest = async (code) => {
    try {
        const config = {
            method: "post",
            url: `${EMAILSERVICEBASEURL}/getbycode`,
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                code,
            },
        };
        let res = await axios(config);
        return {
            success: true,
            status: res.status,
            data: res.data,
        };
    } catch (e) {
        return {
            success: false,
            status: e.response && e.response.status,
            data: e.response && e.response.data,
        };
    }
};

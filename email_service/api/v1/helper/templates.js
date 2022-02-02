const { BASEURL } = require("../../../config");

exports.verificationMailtemplate = ({ name, username, code }) => {
    let url = BASEURL + "/api/v1/user";
    let subject = "Verification Link for Account";
    let message = `
    Dear ${name},

    You are just one step behind to verify your account and get most out of it 
    Please click the link below to confirm your account creation with username ${username}

    ${url}/email_verify/${code}
    `;
    return { subject, message };
};

exports.forgotPasswordMail = ({ username, code, name }) => {
    let subject = `Update Password Link For Username ${username}`;
    let message = `
    Dear ${name},
    For updating the password add this token as code:[token] and send password both in the body
    If not requested then ignore this mail .You can login through your old password
    
    ${code}
    `;
    return { subject, message };
};

exports.friendrequestNotification = ({ username, name }) => {
    let subject = `New friend request from ${username}`;
    let message = `
    Dear ${name},
    You have got a new frined request from ${username}
    `;
    return { subject, message };
};

exports.friendrequestAcceptedNotification = ({ username, name }) => {
    let subject = `${username} has accepted your friend request`;
    let message = `
    Dear ${name},
    ${username} has accepted your friend request. Please login to check.
    `;
    return { subject, message };
};

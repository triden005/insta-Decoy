const { Email } = require("./email.model");
const { v4: uuid } = require("uuid");
const { transporter } = require("./helper/transporter");
async function sendEmail(to, subject, text) {
    await transporter.sendMail({
        to,
        subject: subject || "Testing mail",
        text,
    });
    return;
}
async function getOnebyparam(param) {
    let doc = await Email.findOne({ eventparam: param }).exec();
    return doc;
}
async function deleteOne(id) {
    let doc = await Email.deleteOne({ _id: id });
    return doc;
}
async function createOne(eventName, associatedUser) {
    let param = await uuid();
    console.log(param);

    let doc = await Email.create({
        eventparam: param,
        eventName,
        associatedUser,
    });

    return doc;
}

module.exports = { sendEmail, createOne, deleteOne, getOnebyparam };

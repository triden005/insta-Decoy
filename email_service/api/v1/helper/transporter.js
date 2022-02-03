const nodemailer = require("nodemailer");
const { EMAIL, EMAILKEY, EMAILTRANSPORTER } = require("../../../config");

if (EMAILTRANSPORTER === "gmail") {
    const transporterGmail = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL,
            pass: EMAILKEY,
        },
    });
    module.exports.transporter = transporterGmail;
} else {
    const transporterEthereal = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: "smwtrsmjipejx63c@ethereal.email",
            pass: "Kz5jEsRGrTJPjY7XfM",
        },
    });
    module.exports.transporter = transporterEthereal;
}

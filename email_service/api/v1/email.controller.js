const EmailService = require("./email.service");
const {
    emailValidator,
    IdValidator,
    eventValidator,
    verificationCodeValidator,
} = require("./email.validator");
/**
 * Sends Email after validation of {email,body,text} in the body
 */
exports.sendEmail = async (req, res) => {
    const { email: to, subject, text } = req.body;
    try {
        if (!emailValidator(to)) {
            return res.status(400).json({ message: "Invalid Email" });
        }
        if (!subject)
            return res.status(400).json({ message: "subject cannot be empty" });
        if (!text)
            return res
                .status(401)
                .json({ message: "Eamil Body cannot be empty" });
        await EmailService.sendEmail(to, subject, text);
        return res.status(200).json({ message: "email sent successfully" });
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
};
/**
 * DeleteOneEmail Document on remote request should have id in body
 */
exports.deleteOnebyId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        if (!IdValidator(id))
            return res.status(404).json({ message: "Invalid ID" });

        await EmailService.deleteOneById(id);
        return res.status(200).send();
    } catch (e) {
        console.log(e.message);
        return res.status(404).json({ message: "Invalid Request" });
    }
};
/**
 * Created Email Entry on remote Request body should have { eventName, email, userId, username, name }
 */
exports.createEmailEntry = async (req, res) => {
    try {
        const { eventName, email, userId, username, name } = req.body;
        if (!IdValidator(userId) || !eventValidator(eventName)) {
            return res.status(400).json({ message: "invalid entry" });
        }
        let doc = await EmailService.createOne(eventName, userId);
        let success = await EmailService.sendEventEmail(
            eventName,
            email,
            username,
            name,
            doc.verificationCode,
            doc.id,
        );
        if (!success) {
            await EmailService.changeSendStatus(doc.id);
        }
        return res.status(201).json(doc);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
};
/**
 * Get One Email Document By remote Request and deletes the Document at the same time
 */
exports.getOneByCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!verificationCodeValidator(code))
            return res.status(404).json({ message: "invalid code" });
        let doc = await EmailService.findOneAndDeleteByCode(code);
        if (!doc)
            return res.status(404).json({ message: "Emailrecord dont exists" });
        return res.status(200).json(doc);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

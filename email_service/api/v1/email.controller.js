const EmailService = require("./email.service");
const {
    emailvalidator,
    IDvalidator,
    eventvalidator,
    emailCodeValidator,
} = require("./email.validator");

exports.sendEmail = async (req, res) => {
    const { to, subject, text } = req.body;
    try {
        if (!emailvalidator(to)) {
            return res.status(400).json({ message: "Invalid Email(to)" });
        }
        if (!subject)
            return res.status(400).json({ message: "subject cannot be empty" });
        if (!text)
            return res
                .status(401)
                .json({ message: "Eamil Body cannot be empty" });
        await EmailService.sendEmail(to, subject, text);
        return res.status(201).json({ message: "email sent successfully" });
    } catch (e) {
        return res.status(500).send({ message: e.message });
    }
};
exports.deleteOnebyId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!IDvalidator(id))
            return res.status(404).json({ message: "Invalid ID" });

        await EmailService.deleteOne(id);
        return res.status(202).send();
    } catch (e) {
        return res.status(404).json({ message: "Invalid ID" });
    }
};
exports.createEmailentry = async (req, res) => {
    try {
        const { eventName, userId } = req.body;
        if (!IDvalidator(userId) || !eventvalidator(eventName)) {
            return res.status(400).json({ message: "invalid entry" });
        }
        let doc = await EmailService.createOne(eventName, userId);
        return res.status(201).json(doc);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
exports.getOneByCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!emailCodeValidator(code))
            return res.status(404).json({ message: "invalid code" });
        let doc = await EmailService.getOnebyparam(code);
        if (!doc)
            return res.status(404).json({ message: "Emailrecord dont exists" });
        return res.status(200).json(doc);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

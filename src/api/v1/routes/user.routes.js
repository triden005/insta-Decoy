const { Router } = require("express");
const { transporter } = require("../helpers/transporter");

const userRouter = Router();
userRouter.post("/", async (req, res) => {
    const { to, subject, email_body } = req.body;
    try {
        await transporter.sendMail({
            to,
            subject: subject || "Testing mail",
            text: email_body,
        });
        return res
            .status(200)
            .json({
                success: true,
                message: "Email sent successfully",
            })
            .end();
    } catch (e) {
        console.log(e.message, "at route POST /");
        return res
            .status(500)
            .json({ success: false, message: e.message })
            .end();
    }
});
module.exports = userRouter;

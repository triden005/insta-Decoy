const express = require("express"),
    morgan = require("morgan");

const { PORT, MODE, SERVICETOKEN } = require("./config");
const { connect } = require("./api/v1/helper/dbconnect");
const emailRouter = require("./api/v1/email.router");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
// routes
app.use((req, res, next) => {
    if (req.headers["authorization"] !== SERVICETOKEN) {
        return res.sendStatus(401);
    }
    next();
});

app.use("/", emailRouter);
app.get("/ping", (_req, res) => {
    res.status(200).send("pong");
});

// dead end
app.use((_req, res) => {
    res.status(404).json({ message: "verb not supported" }).end();
});

const start = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(`Server is running in ${MODE} at port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
};
start();

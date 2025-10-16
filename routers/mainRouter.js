const {Router} = require("express");
const {authenticationRouter} = require("./authenticationRouter");
const db = require("../db/queries");
const mainRouter = Router();

mainRouter.get("/", (req, res) => {
    res.redirect("/chat")
});

mainRouter.get("/chat", async (req, res) => {
    const messages = await db.getMessages();
    console.log(messages);
    res.render("index", {subpage: "chat", subargs: {title: "Chat", messages}, user: req.user });
});

mainRouter.post("/chat", (req, res) => {
    const {message} = req.query;
    const {email} = req.user;
    // TODO: validation and formatting
    db.addMessage(email, message, Date.now());
});

mainRouter.use(authenticationRouter);

module.exports = mainRouter;
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
    console.log(req.user)
    res.render("index", {subpage: "chat", subargs: {title: "Chat", messages}, user: req.user });
});

mainRouter.post("/chat", async (req, res) => {
    const {message} = req.body;
    const {email} = req.user || {email: "sample (not logged in)"};
    const now = new Date(Date.now()).toISOString();
    const {id} = await db.getUserByUsername(email) || {id: 1};
    console.log(id, message, now);
    db.addMessage(id, message, now);
    res.redirect("/");
});

mainRouter.use(authenticationRouter);

module.exports = mainRouter;
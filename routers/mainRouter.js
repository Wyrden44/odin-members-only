const {Router} = require("express");
const {authenticationRouter} = require("./authenticationRouter");
const db = require("../db/queries");
const mainRouter = Router();

mainRouter.get("/", (req, res) => {
    res.redirect("/chat")
});

mainRouter.get("/chat", (req, res) => {
    res.render("index", {title: "Chat", subpage: "chat", subargs: {}, user: req.user });
});

mainRouter.post("/chat", (req, res) => {
    const {message} = req.query;
    const {email} = req.user;
    // TODO: validation and formatting
    db.addMessage(email, message, Date.now());
});

mainRouter.use(authenticationRouter);

module.exports = mainRouter;
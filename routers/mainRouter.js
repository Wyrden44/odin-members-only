const {Router} = require("express");
const {authenticationRouter} = require("./authenticationRouter");

const mainRouter = Router();

mainRouter.get("/", (req, res) => {
    console.log(req.user);
    res.render("index", {title: "Home", user: req.user })
});

mainRouter.use(authenticationRouter);

module.exports = mainRouter;
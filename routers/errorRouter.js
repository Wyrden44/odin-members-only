const {Router} = require("express");
const errorRouter = Router();

errorRouter.use((req, res, next) => {
    console.log("IN1")
  res.status(404);
  next(new Error("Page does not exist!"));
});

errorRouter.use((err, req, res, next) => {
  if (res.statusCode < 400) {
    res.status(500);
  }

  res.render("index", {
    subpage: "error",
    title: "Error Page",
    user: req.user,
    subargs: { error: err, statusCode: res.statusCode }
  });
});

module.exports = errorRouter;

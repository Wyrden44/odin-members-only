require("dotenv").config();
const path = require("node:path");
const express = require("express");
const app = express();
const mainRouter = require("./routers/mainRouter");
const session = require("express-session");
const passport = require("passport");

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(mainRouter);

app.listen(process.env.PORT || 3000, err => {
    if (err) {
        throw err;
    }
    console.log("App is running on port ", process.env.PORT || 3000);
});

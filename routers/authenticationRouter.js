const {Router} = require("express");
var LocalStrategy = require('passport-local');
var bcrypt = require('bcryptjs');
const passport = require("passport");
const db = require("../db/queries");
const formValidator = require("../controllers/formValidator");
const { validationResult } = require("express-validator");

const authenticationRouter = Router();

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await db.getUserByUsername(username);

        if (!user) {
            return done(null, false, {message: "Incorrect username"});
        }

        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return done(null, false, {message: "Incorrect password"});
        }
        
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.getUser(id);
        if (user) {
            return done(null, user);
        }
    }
    catch (err) {
        return done(err);
    }
});

authenticationRouter.get("/login", (req, res) => {
    res.render("index", {user: req.user, subpage: "login", subargs: {title: "Log In"}});
});

authenticationRouter.get("/signup", (req, res) => {
    res.render("index", {user: req.user, subpage: "signup", subargs: {title: "Sign Up"}});
});

authenticationRouter.post("/login/password", 
    formValidator.loginValidator,
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length !== 0) {
            return res.render("index", {user: req.user, subpage: "login", subargs: {title: "Log In", errors}});
        }
        next();
    },
    passport.authenticate("local", {
        successRedirect: "/",
        failureMessage: true,
        failureRedirect: "/login"
}));

authenticationRouter.post("/signup",
    formValidator.signupValidator,
    (req, res, next) => {
        const errors = validationResult(req).array();
        if (errors.length !== 0) {
            return res.render("index", {user: req.user, subpage: "signup", subargs: {title: "Sign Up", errors}});
        }
        next();
    },
    async (req, res, next) => {
    try {
        const {firstname, lastname, username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.addUser(firstname, lastname, username, 1, hashedPassword);
        res.redirect("/login");
    } catch (error) {
        next(error);
    }
});

module.exports = {authenticationRouter};

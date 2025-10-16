const {Router} = require("express");
var LocalStrategy = require('passport-local');
var bcrypt = require('bcryptjs');
const passport = require("passport");
const db = require("../db/queries");

const authenticationRouter = Router();

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await db.getUserByUsername(username);

        if (!user) {
            return done(null, false, {message: "Incorrect username"});
        }

        const match = await bcrypt.compare(password, user.password);
        console.log(match, password, user.password)
        
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
    console.log(req.session.messages)
    res.render("index", {user: req.user, subpage: "login", subargs: {title: "Log In"}});
});

authenticationRouter.get("/signup", (req, res) => {
    console.log(req.session.messages)
    res.render("index", {user: req.user, subpage: "signup", subargs: {title: "Sign Up"}});
});

authenticationRouter.post("/login/password", passport.authenticate("local", {
    successRedirect: "/",
    failureMessage: true,
    failureRedirect: "/"
}));

authenticationRouter.post("/signup", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await db.addUser(req.body.username, hashedPassword);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = {authenticationRouter};

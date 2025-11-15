const {body, param} = require("express-validator");
const db = require("../db/queries");

const loginFields = [
    "username",
    "password"
]

const signUpFields = [
    "firstname",
    "lastname",
    "username",
    "password"
]

exports.loginValidator = [
    body("username").trim()
        .isEmail().withMessage("Username should be an email"),
    body("password").trim()
        .notEmpty().withMessage("Please enter a password"),
    body(loginFields).isLength({max: 255})
        .withMessage("Max length is 255")
];

exports.signupValidator = [
    body("firstname").trim()
        .notEmpty().withMessage("Please enter your name"),
    body("lastname").trim()
        .notEmpty().withMessage("Please enter your last name"),
    body("username").trim()
        .isEmail()
        .custom(async value => {
            const user = await db.getUserByUsername(value);

            if (user != null) {
                throw new Error("Username already in use");
            }
        }),
    body("password").trim()
        .notEmpty().withMessage("Please enter a password"),
    body(signUpFields).isLength({max: 255})
        .withMessage("Max length is 255")
];

exports.messageValidator = [
    body("message").trim()
        .notEmpty().withMessage("Message should not be empty")
        .isLength({max: 255}).withMessage("Max message length is 255")
        .escape()
];

exports.deleteMessageValidator = [
    param("messageId").isInt({min: 1}).withMessage("Message id has to be an Integer")
]

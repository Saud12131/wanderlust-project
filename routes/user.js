const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware");
const usercontoller = require("../controller/user");


router.get("/signup", usercontoller.signupget);

router.post("/signup", wrapasync(usercontoller.signuppost));

router.get("/login", usercontoller.loginget);

router.post("/login",
    saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    usercontoller.login);


router.get("/logout", usercontoller.logout);

module.exports = router;